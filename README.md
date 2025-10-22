# 🚀 Landing Page com Banco de Dados

Uma landing page moderna e responsiva com sistema de captura de leads integrado a um banco de dados SQLite.

## ✨ Funcionalidades

- **Landing Page Responsiva**: Design moderno que funciona em desktop, tablet e mobile
- **Formulário de Captura**: Campos para Nome Completo, E-mail e WhatsApp
- **Validação em Tempo Real**: Validação client-side e server-side
- **Banco de Dados SQLite**: Armazenamento local dos dados dos leads
- **API RESTful**: Endpoints para salvar e consultar dados
- **Segurança**: Rate limiting, validação de dados e proteção contra spam
- **Máscara Automática**: Formatação automática do WhatsApp brasileiro

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animações)
- JavaScript (ES6+)
- Font Awesome (Ícones)

### Backend
- Node.js
- Express.js
- SQLite3
- CORS
- Helmet (Segurança)
- Express Rate Limit

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar o Servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

### 3. Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

## 📊 Estrutura do Banco de Dados

### Tabela: `leads`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária (auto incremento) |
| `nome_completo` | TEXT | Nome completo do lead |
| `email` | TEXT | E-mail único do lead |
| `whatsapp` | TEXT | WhatsApp (apenas números) |
| `data_cadastro` | DATETIME | Data e hora do cadastro |
| `ip_address` | TEXT | IP do usuário |
| `user_agent` | TEXT | Navegador/dispositivo do usuário |

## 🔌 Endpoints da API

### POST `/api/save-lead`
Salva um novo lead no banco de dados.

**Body:**
```json
{
  "nomeCompleto": "João Silva",
  "email": "joao@email.com",
  "whatsapp": "(11) 99999-9999"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso!",
  "leadId": 1
}
```

**Resposta de Erro:**
```json
{
  "success": false,
  "message": "Este e-mail já está cadastrado"
}
```

### GET `/api/leads` (Desenvolvimento)
Lista todos os leads cadastrados.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome_completo": "João Silva",
      "email": "joao@email.com",
      "whatsapp": "11999999999",
      "data_cadastro": "2024-01-15 10:30:00",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0..."
    }
  ],
  "total": 1
}
```

### GET `/api/stats`
Retorna estatísticas básicas.

**Resposta:**
```json
{
  "success": true,
  "totalLeads": 25
}
```

## 🔒 Segurança

- **Rate Limiting**: Máximo 100 requests por IP a cada 15 minutos
- **Validação de Dados**: Validação client-side e server-side
- **Sanitização**: Limpeza automática dos dados de entrada
- **CORS**: Configurado para desenvolvimento
- **Helmet**: Headers de segurança HTTP

## 📱 Responsividade

A landing page é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout em duas colunas
- **Tablet**: Layout adaptado com espaçamentos otimizados
- **Mobile**: Layout em coluna única com botões touch-friendly

## 🎨 Personalização

### Cores
As cores principais podem ser alteradas no arquivo `styles.css`:
- Gradiente principal: `#667eea` → `#764ba2`
- Cor de sucesso: `#10b981`
- Cor de erro: `#ef4444`

### Textos
Todos os textos podem ser personalizados no arquivo `index.html`.

## 📁 Estrutura de Arquivos

```
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript do frontend
├── server.js           # Servidor Node.js
├── package.json        # Dependências do projeto
├── database.sqlite     # Banco de dados (criado automaticamente)
└── README.md           # Este arquivo
```

## 🐛 Solução de Problemas

### Erro de Conexão com Banco de Dados
```bash
# Verificar se o Node.js está instalado
node --version

# Reinstalar dependências
rm -rf node_modules
npm install
```

### Porta já em Uso
```bash
# Alterar a porta no arquivo server.js
const PORT = process.env.PORT || 3001;
```

### Problemas de CORS
O CORS está configurado para desenvolvimento. Em produção, configure adequadamente no arquivo `server.js`.

## 🚀 Deploy em Produção

### 1. Preparar para Produção
```bash
# Instalar apenas dependências de produção
npm install --production

# Definir variável de ambiente
export NODE_ENV=production
```

### 2. Usar PM2 (Recomendado)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "landing-page"

# Salvar configuração
pm2 save
pm2 startup
```

## 📈 Próximos Passos

- [ ] Integração com serviços de e-mail (SendGrid, Mailgun)
- [ ] Dashboard administrativo
- [ ] Exportação de dados (CSV, Excel)
- [ ] Integração com CRM
- [ ] Analytics e métricas avançadas
- [ ] Testes automatizados

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ para captura de leads eficiente!**
