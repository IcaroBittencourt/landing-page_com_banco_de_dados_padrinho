const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco de dados:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Função para limpar todos os usuários e resetar o contador de ID
function clearAllUsers() {
  // Primeiro, verificar se a tabela existe e criar se necessário
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
  
  db.run(createTableQuery, [], function(err) {
    if (err) {
      console.error('❌ Erro ao criar tabela:', err.message);
      db.close();
      return;
    }
    
    console.log('✅ Tabela verificada/criada com sucesso');
    
    // Depois, apagar todos os registros
    const deleteQuery = 'DELETE FROM leads';
    
    db.run(deleteQuery, [], function(err) {
      if (err) {
        console.error('❌ Erro ao limpar banco de dados:', err.message);
        db.close();
        return;
      }
      
      console.log(`✅ ${this.changes} usuário(s) apagado(s) com sucesso!`);
      
      // Depois, resetar o contador de ID (AUTO_INCREMENT)
      const resetQuery = 'DELETE FROM sqlite_sequence WHERE name = "leads"';
      
      db.run(resetQuery, [], function(err) {
        if (err) {
          console.error('❌ Erro ao resetar contador de ID:', err.message);
        } else {
          console.log('✅ Contador de ID resetado com sucesso!');
          console.log('🔄 Próximo ID será: 1');
        }
        
        db.close((err) => {
          if (err) {
            console.error('❌ Erro ao fechar banco de dados:', err.message);
          } else {
            console.log('✅ Banco de dados fechado');
            console.log('\n🎉 Banco de dados completamente limpo e resetado!');
          }
        });
      });
    });
  });
}

console.log('🗑️  Limpando todos os usuários e resetando contador de ID...\n');
clearAllUsers();
