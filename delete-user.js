const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const path = require('path');

// Configurar interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Função para listar todos os usuários
function listUsers() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, nome_completo, email, data_cadastro FROM leads ORDER BY data_cadastro DESC';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Função para apagar usuário por ID
function deleteUserById(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM leads WHERE id = ?';
    
    db.run(query, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

// Função para apagar usuário por email
function deleteUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM leads WHERE email = ?';
    
    db.run(query, [email], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

// Função principal
async function main() {
  try {
    console.log('\n🗑️  Gerenciador de Usuários - TYLTY HUB\n');
    
    // Listar usuários
    const users = await listUsers();
    
    if (users.length === 0) {
      console.log('📭 Nenhum usuário encontrado no banco de dados.');
      process.exit(0);
    }
    
    console.log('📋 Usuários cadastrados:\n');
    users.forEach(user => {
      console.log(`ID: ${user.id} | Nome: ${user.nome_completo} | Email: ${user.email} | Data: ${user.data_cadastro}`);
    });
    
    console.log('\nOpções:');
    console.log('1. Apagar por ID');
    console.log('2. Apagar por email');
    console.log('3. Sair');
    
    rl.question('\nEscolha uma opção (1-3): ', async (option) => {
      switch (option) {
        case '1':
          rl.question('Digite o ID do usuário para apagar: ', async (id) => {
            try {
              const changes = await deleteUserById(id);
              if (changes > 0) {
                console.log(`✅ Usuário com ID ${id} apagado com sucesso!`);
              } else {
                console.log(`❌ Usuário com ID ${id} não encontrado.`);
              }
            } catch (error) {
              console.error('❌ Erro ao apagar usuário:', error.message);
            }
            db.close();
            rl.close();
          });
          break;
          
        case '2':
          rl.question('Digite o email do usuário para apagar: ', async (email) => {
            try {
              const changes = await deleteUserByEmail(email);
              if (changes > 0) {
                console.log(`✅ Usuário com email ${email} apagado com sucesso!`);
              } else {
                console.log(`❌ Usuário com email ${email} não encontrado.`);
              }
            } catch (error) {
              console.error('❌ Erro ao apagar usuário:', error.message);
            }
            db.close();
            rl.close();
          });
          break;
          
        case '3':
          console.log('👋 Saindo...');
          db.close();
          rl.close();
          break;
          
        default:
          console.log('❌ Opção inválida!');
          db.close();
          rl.close();
      }
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    db.close();
    rl.close();
  }
}

// Executar função principal
main();
