const db = require('../database/db');
const bcrypt = require('bcrypt');

const cadastrarProfessor = async (req, res) => {
  const { email, senha, nome, titulacao, area, tempo_docencia } = req.body;

  if (!email || !senha || !nome || !titulacao || !area) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  const client = await db.getPool().connect();

  try {
    await client.query('BEGIN');

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Inserir na tabela usuarios
    const insertUsuarioQuery = `
      INSERT INTO usuarios (email, senha, perfil)
      VALUES ($1, $2, 'professor')
      RETURNING id_usuario
    `;
    const usuarioResult = await client.query(insertUsuarioQuery, [email, senhaHash]);
    const id_usuario = usuarioResult.rows[0].id_usuario;

    // Inserir na tabela professores
    const insertProfessorQuery = `
      INSERT INTO professores (id_usuario, nome, titulacao, area, tempo_docencia)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_professor
    `;
    const professorResult = await client.query(insertProfessorQuery, [id_usuario, nome, titulacao, area, tempo_docencia || null]);
    const id_professor = professorResult.rows[0].id_professor;

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Professor cadastrado com sucesso!',
      professor: {
        id_professor,
        id_usuario,
        nome,
        titulacao,
        area
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar professor:', error);

    if (error.code === '23505') {
      return res.status(409).json({ error: 'E-mail já está em uso.' });
    }

    res.status(500).json({ error: 'Erro interno no servidor ao cadastrar professor.' });
  } finally {
    client.release();
  }
};

const getDisciplinasProfessor = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Buscar o ID real do professor baseado no id_usuario logado
    const profResult = await db.query('SELECT id_professor FROM professores WHERE id_usuario = $1', [id_usuario]);
    
    if (profResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado.' });
    }

    const id_professor = profResult.rows[0].id_professor;

    // Buscar as disciplinas atreladas ao professor
    const query = `
      SELECT id_disciplina, nome, curso, semestre, carga_horaria 
      FROM disciplinas 
      WHERE professor_id = $1
      ORDER BY semestre, nome
    `;
    const disciplinasResult = await db.query(query, [id_professor]);

    res.json(disciplinasResult.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas do professor:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  cadastrarProfessor,
  getDisciplinasProfessor
};
