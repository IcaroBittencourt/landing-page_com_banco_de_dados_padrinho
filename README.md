# 🚀 Landing Page - Codiguinhos do Padrinho

Landing page profissional para captura de leads com banco de dados SQLite.

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal
├── package.json            # Configurações do projeto
├── README.md              # Documentação
├── backend/
│   └── server.js          # Servidor Node.js/Express
├── database/
│   └── database.sqlite    # Banco de dados SQLite
├── config/
│   ├── package.json       # Configurações originais
│   └── package-lock.json  # Lock file
├── scripts/
│   ├── clear-database.js  # Script para limpar banco
│   ├── delete-user.js     # Script para deletar usuários
│   └── script.js          # Scripts do frontend
├── pages/
│   └── thank-you.html     # Página de agradecimento
├── styles/
│   └── styles.css         # Estilos CSS
├── assets/                # Imagens e recursos
└── fonts/                 # Fontes personalizadas
```

## 🛠️ Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 🗄️ Gerenciamento do Banco de Dados

### Limpar todos os usuários
```bash
npm run clear-db
```

### Deletar usuário específico
```bash
npm run delete-user
```

## 🌐 Hospedagem

Recomendado para hospedagem na **Hostinger** com plano de hosting compartilhado que suporte Node.js.

## 📊 Funcionalidades

- ✅ Formulário de captura de leads
- ✅ Validação de dados
- ✅ Banco de dados SQLite
- ✅ Rate limiting
- ✅ Segurança com Helmet
- ✅ CORS configurado
- ✅ Página de agradecimento
- ✅ Scripts de gerenciamento

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Banco de Dados:** SQLite3
- **Segurança:** Helmet, Rate Limiting
- **Fontes:** MarkPro (personalizada)