-- Criação da tabela centralizadora de autenticação
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('aluno', 'professor', 'admin'))
);

-- Criação da tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
    id_aluno SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(100) UNIQUE NOT NULL,
    curso VARCHAR(255) NOT NULL,
    telefone VARCHAR(20)
);

-- Criação da tabela de localização (associada ao aluno)
CREATE TABLE IF NOT EXISTS localizacao (
    id_localizacao SERIAL PRIMARY KEY,
    id_aluno INTEGER UNIQUE NOT NULL REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    cep VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

-- Criação da tabela de professores
CREATE TABLE IF NOT EXISTS professores (
    id_professor SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    titulacao VARCHAR(100) NOT NULL,
    area VARCHAR(255) NOT NULL,
    tempo_docencia INTEGER
);

-- Criação da tabela de disciplinas
CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplina SERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES professores(id_professor) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    carga_horaria INTEGER NOT NULL,
    curso VARCHAR(255) NOT NULL,
    semestre INTEGER NOT NULL
);

-- Criação da tabela de notas (tabela associativa N:M)
CREATE TABLE IF NOT EXISTS notas (
    id_nota SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE,
    nota1 NUMERIC(4,2),
    nota2 NUMERIC(4,2),
    media NUMERIC(4,2),
    situacao VARCHAR(50) DEFAULT 'Cursando',
    UNIQUE (aluno_id, disciplina_id)
);
