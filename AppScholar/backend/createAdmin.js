require('dotenv').config();
const db = require('./database/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const email = 'admin@appscholar.com';
    const senhaLimpa = '123456';
    
    // Gera o hash corretamente na sua própria máquina
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senhaLimpa, saltRounds);

    const query = `
      INSERT INTO usuarios (email, senha, perfil)
      VALUES ($1, $2, 'admin')
      ON CONFLICT (email) DO UPDATE SET senha = $2
      RETURNING id_usuario, email, perfil;
    `;

    const result = await db.query(query, [email, senhaHash]);
    console.log('✅ Administrador criado/atualizado com sucesso no banco de dados!');
    console.log(result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    process.exit(1);
  }
}

createAdmin();
