const db = require('../database/db');

// Nova Lógica: Matrícula direta de Aluno em uma Disciplina Específica
const matricularAluno = async (req, res) => {
  const { aluno_id, disciplina_id } = req.body;

  if (!aluno_id || !disciplina_id) {
    return res.status(400).json({ error: 'aluno_id e disciplina_id são obrigatórios.' });
  }

  try {
    // Insere na tabela notas (que faz o vínculo real)
    const insertNotaQuery = `
      INSERT INTO notas (aluno_id, disciplina_id, situacao)
      VALUES ($1, $2, 'Cursando')
      ON CONFLICT (aluno_id, disciplina_id) DO NOTHING
      RETURNING *;
    `;

    const result = await db.query(insertNotaQuery, [aluno_id, disciplina_id]);

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'O aluno já está matriculado nesta disciplina.' });
    }

    res.status(201).json({
      message: 'Matrícula realizada com sucesso!',
      matricula: result.rows[0]
    });

  } catch (error) {
    console.error('Erro na matrícula:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao realizar matrícula.' });
  }
};

// Consulta de Boletim (Mantido o seu padrão)
const consultarBoletim = async (req, res) => {
  const { matricula } = req.params;

  try {
    // 1. Buscar dados do aluno
    const alunoResult = await db.query('SELECT id_aluno, nome FROM alunos WHERE matricula = $1', [matricula]);

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado com esta matrícula.' });
    }

    const aluno = alunoResult.rows[0];

    // 2. Buscar disciplinas e notas (JOIN)
    const boletimQuery = `
      SELECT 
        n.id_nota,
        d.nome AS disciplina,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id_disciplina
      WHERE n.aluno_id = $1
    `;
    const boletimResult = await db.query(boletimQuery, [aluno.id_aluno]);

    res.json({
      aluno: aluno.nome,
      disciplinas: boletimResult.rows
    });

  } catch (error) {
    console.error('Erro ao consultar boletim:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao consultar boletim.' });
  }
};

// Atualizar Notas (N1 e N2) e calcular a média (Mantido o seu padrão)
const atualizarNota = async (req, res) => {
  const { id_nota } = req.params;
  let { nota1, nota2 } = req.body;

  try {
    // 1. Converter notas para número ou null se vazio
    nota1 = (nota1 !== undefined && nota1 !== null && nota1 !== '') ? parseFloat(nota1) : null;
    nota2 = (nota2 !== undefined && nota2 !== null && nota2 !== '') ? parseFloat(nota2) : null;

    let media = null;
    let situacao = 'Cursando';

    // 2. Calcular a média e atualizar a situação se as duas notas existirem
    if (nota1 !== null && nota2 !== null) {
      media = (nota1 + nota2) / 2;
      situacao = media >= 6 ? 'Aprovado' : 'Reprovado';
    }

    // 3. Atualizar no banco de dados
    const updateQuery = `
      UPDATE notas 
      SET nota1 = $1, nota2 = $2, media = $3, situacao = $4
      WHERE id_nota = $5
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, [nota1, nota2, media, situacao, id_nota]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro de nota não encontrado.' });
    }

    res.json({
      message: 'Notas atualizadas com sucesso!',
      nota: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar notas:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = {
  matricularAluno,
  consultarBoletim,
  atualizarNota
};