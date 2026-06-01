const db = require('../database/db');

// Automação de Alocação de Semestre (Matrícula em Lote)
const matricularSemestre = async (req, res) => {
  const { id_aluno, curso, semestre } = req.body;

  if (!id_aluno || !curso || !semestre) {
    return res.status(400).json({ error: 'id_aluno, curso e semestre são obrigatórios.' });
  }

  const client = await db.getPool().connect();

  try {
    await client.query('BEGIN');

    // 1. Buscar todas as disciplinas do curso e semestre
    const disciplinasQuery = `
      SELECT id_disciplina 
      FROM disciplinas 
      WHERE curso = $1 AND semestre = $2
    `;
    const disciplinasResult = await client.query(disciplinasQuery, [curso, semestre]);

    if (disciplinasResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Nenhuma disciplina encontrada para este curso e semestre.' });
    }

    const disciplinas = disciplinasResult.rows;
    let disciplinasMatriculadas = 0;

    // 2. Inserir na tabela notas para cada disciplina
    const insertNotaQuery = `
      INSERT INTO notas (aluno_id, disciplina_id, situacao)
      VALUES ($1, $2, 'Cursando')
      ON CONFLICT (aluno_id, disciplina_id) DO NOTHING
    `;

    for (const disciplina of disciplinas) {
      const result = await client.query(insertNotaQuery, [id_aluno, disciplina.id_disciplina]);
      if (result.rowCount > 0) {
        disciplinasMatriculadas++;
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Matrícula em lote realizada com sucesso!',
      disciplinasEncontradas: disciplinas.length,
      novasMatriculas: disciplinasMatriculadas
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro na matrícula de semestre:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao realizar matrícula.' });
  } finally {
    client.release();
  }
};

// Consulta de Boletim
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

// Atualizar Notas (N1 e N2) e calcular a média
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
  matricularSemestre,
  consultarBoletim,
  atualizarNota
};
