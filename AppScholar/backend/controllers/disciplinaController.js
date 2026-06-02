const db = require("../database/db");

const cadastrarDisciplina = async (req, res) => {
  const { professor_id, nome, carga_horaria, curso, semestre } = req.body;

  if (!professor_id || !nome || !carga_horaria || !curso || !semestre) {
    return res
      .status(400)
      .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  try {
    const insertQuery = `
      INSERT INTO disciplinas (professor_id, nome, carga_horaria, curso, semestre)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      professor_id,
      nome,
      carga_horaria,
      curso,
      semestre,
    ]);

    res.status(201).json({
      message: "Disciplina cadastrada com sucesso!",
      disciplina: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao cadastrar disciplina:", error);
    res
      .status(500)
      .json({ error: "Erro interno no servidor ao cadastrar disciplina." });
  }
};

const getAlunosDisciplina = async (req, res) => {
  const { id_disciplina } = req.params;

  try {
    const query = `
      SELECT n.id_nota, a.nome AS aluno_nome, a.matricula, n.nota1, n.nota2, n.media, n.situacao
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id_aluno
      WHERE n.disciplina_id = $1
      ORDER BY a.nome
    `;
    const result = await db.query(query, [id_disciplina]);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar alunos da disciplina:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

const listarDisciplinas = async (req, res) => {
  try {
    // Busca todas as disciplinas ordenadas por nome
    const query = `
      SELECT id_disciplina, nome, curso, semestre, carga_horaria 
      FROM disciplinas 
      ORDER BY nome ASC;
    `;
    
    // Supondo que você usa o mesmo padrão de "db" dos outros controllers
    const db = require('../database/db'); 
    const resultado = await db.query(query);

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar as disciplinas.' });
  }
};

module.exports = {
  cadastrarDisciplina,     
  getAlunosDisciplina,     
  listarDisciplinas        
};
