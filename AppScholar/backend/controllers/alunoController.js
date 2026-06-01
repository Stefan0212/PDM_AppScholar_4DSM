const db = require('../database/db');
const bcrypt = require('bcrypt');

const cadastrarAluno = async (req, res) => {
  const { email, senha, nome, matricula, curso, telefone, cep, endereco, cidade, estado } = req.body;

  // Validação básica
  if (!email || !senha || !nome || !matricula || !curso || !cep || !endereco || !cidade || !estado) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  const client = await db.getPool().connect();

  try {
    // Iniciar a transação
    await client.query('BEGIN');

    // 1. Gerar Hash da Senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 2. Inserir na tabela usuarios (perfil 'aluno')
    const insertUsuarioQuery = `
      INSERT INTO usuarios (email, senha, perfil)
      VALUES ($1, $2, 'aluno')
      RETURNING id_usuario
    `;
    const usuarioResult = await client.query(insertUsuarioQuery, [email, senhaHash]);
    const id_usuario = usuarioResult.rows[0].id_usuario;

    // 3. Inserir na tabela alunos
    const insertAlunoQuery = `
      INSERT INTO alunos (id_usuario, nome, matricula, curso, telefone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_aluno
    `;
    const alunoResult = await client.query(insertAlunoQuery, [id_usuario, nome, matricula, curso, telefone || null]);
    const id_aluno = alunoResult.rows[0].id_aluno;

    // 4. Inserir na tabela localizacao
    const insertLocalizacaoQuery = `
      INSERT INTO localizacao (id_aluno, cep, endereco, cidade, estado)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await client.query(insertLocalizacaoQuery, [id_aluno, cep, endereco, cidade, estado]);

    // Efetivar a transação
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Aluno cadastrado com sucesso!',
      aluno: {
        id_aluno,
        id_usuario,
        nome,
        matricula,
        curso
      }
    });

  } catch (error) {
    // Reverter todas as inserções em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar aluno:', error);
    
    // Tratamento de erros de restrição única (ex: email ou matricula duplicados)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'E-mail ou matrícula já estão em uso.' });
    }

    res.status(500).json({ error: 'Erro interno no servidor ao cadastrar aluno.' });
  } finally {
    // Liberar o cliente de volta para o pool
    client.release();
  }
};

module.exports = {
  cadastrarAluno
};
