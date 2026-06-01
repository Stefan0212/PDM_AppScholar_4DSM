const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    // Buscar usuário pelo e-mail
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    const usuario = result.rows[0];

    // Verificar se a senha confere
    const isMatch = await bcrypt.compare(senha, usuario.senha);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    // Criar o payload para o token JWT
    const payload = {
      id_usuario: usuario.id_usuario,
      perfil: usuario.perfil
    };

    // Obter mais detalhes dependendo do perfil (opcional, mas recomendado para retornar dados úteis)
    let nome = 'Usuário';
    let matricula = null;
    
    if (usuario.perfil === 'aluno') {
      const alunoResult = await db.query('SELECT nome, matricula FROM alunos WHERE id_usuario = $1', [usuario.id_usuario]);
      if (alunoResult.rows.length > 0) {
        nome = alunoResult.rows[0].nome;
        matricula = alunoResult.rows[0].matricula;
      }
    } else if (usuario.perfil === 'professor') {
      const profResult = await db.query('SELECT nome FROM professores WHERE id_usuario = $1', [usuario.id_usuario]);
      if (profResult.rows.length > 0) nome = profResult.rows[0].nome;
    }

    // Gerar o token (expira em 1 dia)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: nome,
        perfil: usuario.perfil,
        matricula: matricula
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

module.exports = {
  login
};
