const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet());

// Rate limiting para prevenir spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP a cada 15 minutos
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use('/api/', limiter);

// CORS para permitir requisições do frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));

// Body parser para JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Configuração do banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
    initDatabase();
  }
});

// Função para inicializar o banco de dados
function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_completo TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      whatsapp TEXT NOT NULL,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('✅ Tabela "leads" criada/verificada com sucesso');
    }
  });
}

// Endpoint para salvar dados do formulário
app.post('/api/save-lead', (req, res) => {
  const { nomeCompleto, email, whatsapp } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  // Validação básica dos dados
  if (!nomeCompleto || !email || !whatsapp) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios'
    });
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'E-mail inválido'
    });
  }

  // Validação de WhatsApp (apenas números)
  const whatsappClean = whatsapp.replace(/\D/g, '');
  if (whatsappClean.length !== 11) {
    return res.status(400).json({
      success: false,
      message: 'WhatsApp deve ter 11 dígitos'
    });
  }

  // Inserir dados no banco
  const insertQuery = `
    INSERT INTO leads (nome_completo, email, whatsapp, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(insertQuery, [nomeCompleto, email, whatsappClean, ipAddress, userAgent], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
          success: false,
          message: 'Este e-mail já está cadastrado'
        });
      }
      
      console.error('Erro ao inserir dados:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }

    console.log(`✅ Lead cadastrado: ${nomeCompleto} (${email})`);
    res.json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      leadId: this.lastID
    });
  });
});

// Endpoint para listar leads (apenas para desenvolvimento)
app.get('/api/leads', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Endpoint não disponível em produção'
    });
  }

  const query = 'SELECT * FROM leads ORDER BY data_cadastro DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar leads:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados'
      });
    }

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  });
});

// Endpoint para estatísticas básicas
app.get('/api/stats', (req, res) => {
  const query = 'SELECT COUNT(*) as total FROM leads';
  
  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Erro ao buscar estatísticas:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }

    res.json({
      success: true,
      totalLeads: row.total
    });
  });
});

// Rota principal - servir a landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para página de agradecimento
app.get('/thank-you.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'thank-you.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('✅ Banco de dados fechado');
    }
    process.exit(0);
  });
});
