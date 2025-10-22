const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco de dados:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Função para limpar todos os usuários
function clearAllUsers() {
  const query = 'DELETE FROM leads';
  
  db.run(query, [], function(err) {
    if (err) {
      console.error('❌ Erro ao limpar banco de dados:', err.message);
    } else {
      console.log(`✅ ${this.changes} usuário(s) apagado(s) com sucesso!`);
    }
    
    db.close((err) => {
      if (err) {
        console.error('❌ Erro ao fechar banco de dados:', err.message);
      } else {
        console.log('✅ Banco de dados fechado');
      }
    });
  });
}

console.log('🗑️  Limpando todos os usuários do banco de dados...\n');
clearAllUsers();
