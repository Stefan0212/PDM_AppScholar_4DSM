# Documentação de Arquitetura e Backend - App Scholar (Versão Atualizada - Altamente Normalizada)

**Instituição:** Fatec Jacareí
**Professor:** André Olímpio
**Disciplina:** Programação para Dispositivos Móveis I
**Projeto:** Aplicativo Mobile de Gerenciamento de Boletim Acadêmico

---

## 1. Regras para o Desenvolvimento do Backend

O backend funcionará como o motor lógico do sistema, gerenciando a comunicação estável entre o aplicativo mobile e a base de dados relacional.

* **Stack Tecnológica Obrigatória:** O desenvolvimento deve ser realizado estritamente em **Node.js** com o framework **Express.js**.
* **Banco de Dados:** Utilização do **PostgreSQL** para a persistência das tabelas do ecossistema acadêmico.
* **Comunicação:** Arquitetura baseada em **API REST**, com transferência de dados estruturados em formato **JSON**. No aplicativo mobile, as chamadas serão efetuadas por meio de **Axios ou Fetch**.
* **Estrutura Organizacional Sugerida:**
    * `/backend`
    * `/controllers`
    * `/routes`
    * `/models`
    * `/database`
    * `server.js`

---

## 2. Estrutura do Banco de Dados (Modelo Altamente Normalizado)

Seguindo os preceitos de eliminação de redundâncias, isolamento de segurança e escalabilidade arquitetural, os dados de autenticação foram centralizados unicamente na tabela de logins e a localização foi extraída para uma entidade de suporte dedicada (Caminho de Boas Práticas).

### Tabela: `usuarios` (Centralizadora de Autenticação)
* `id_usuario` (Chave Primária)
* `email` (VARCHAR, UNIQUE) -> *Centraliza o login de todos os perfis do sistema, mitigando duplicações.*
* `senha` (VARCHAR -> *armazenando o Hash gerado por bibliotecas como o `bcrypt`*).
* `perfil` (VARCHAR -> *valores válidos: 'aluno', 'professor', 'admin'*).

### Tabela: `alunos`
* `id_aluno` (Chave Primária)
* `id_usuario` (Chave Estrangeira, UNIQUE) -> *Garante o relacionamento estrutural 1:1 com as credenciais de acesso.*
* `nome` (VARCHAR)
* `matricula` (VARCHAR, UNIQUE)
* `curso` (VARCHAR)
* `telefone` (VARCHAR)

### Tabela: `localizacao`
* `id_localizacao` (Chave Primária)
* `id_aluno` (Chave Estrangeira, UNIQUE) -> *Associa o endereço ao aluno isoladamente para respeitar as formas normais de dados.*
* `cep` (VARCHAR)
* `endereco` (VARCHAR)
* `cidade` (VARCHAR)
* `estado` (VARCHAR)

### Tabela: `professores`
* `id_professor` (Chave Primária)
* `id_usuario` (Chave Estrangeira, UNIQUE) -> *Garante o relacionamento estrutural 1:1 com as credenciais de acesso.*
* `nome` (VARCHAR)
* `titulacao` (VARCHAR)
* `area` (VARCHAR)
* `tempo_docencia` (INTEGER)

### Tabela: `disciplinas`
* `id_disciplina` (Chave Primária)
* `professor_id` (Chave Estrangeira ligada à tabela professores)
* `nome` (VARCHAR)
* `carga_horaria` (INTEGER)
* `curso` (VARCHAR)
* `semestre` (INTEGER)

### Tabela: `notas` (Tabela Associativa N:M)
* `id_nota` (Chave Primária)
* `aluno_id` (Chave Estrangeira ligada à tabela alunos)
* `disciplina_id` (Chave Estrangeira ligada à tabela disciplinas)
* `nota1` (NUMERIC(4,2), NULL)
* `nota2` (NUMERIC(4,2), NULL)
* `media` (NUMERIC(4,2), NULL)
* `situacao` (VARCHAR -> *Ex: 'Cursando', 'Aprovado', 'Reprovado'*)

---

## 3. Lógica e Fluxos Estratégicos no Backend

### A. Fluxo de Cadastro de Aluno com Controle de Transação (`TRANSACTION`)
Para efetuar a criação de um aluno de forma segura pelo perfil administrador, o backend deve coordenar inserções em três tabelas sob o escopo de uma mesma transação isolada (`BEGIN`, `COMMIT`, `ROLLBACK`):
1. Efetuar o `INSERT` das credenciais na tabela `usuarios` (definindo o `perfil` como 'aluno'), capturando o ID gerado por meio da cláusula `RETURNING id_usuario`.
2. Efetuar o `INSERT` na tabela `alunos` utilizando o ID obtido para preencher a chave estrangeira `id_usuario`. Capturar o ID do aluno gerado (`RETURNING id_aluno`).
3. Efetuar o `INSERT` na tabela `localizacao` utilizando o ID do aluno para vincular os dados geográficos e de moradia vindos da API de CEP.
4. Caso ocorra qualquer falha em uma das etapas, o comando `ROLLBACK` anulará todo o procedimento em lote, prevenindo falhas de integridade ou registros órfãos.

### B. Automação de Alocação de Semestre (Matrícula em Lote)
O processo de vinculação do aluno às matérias correspondentes ao seu período é gerenciado de forma automatizada na API, eliminando ações manuais repetitivas:
1. O backend recebe a requisição informando o identificador do aluno, o curso e o semestre pretendido.
2. É realizada uma busca ativa na tabela `disciplinas` filtrando por `curso` e `semestre` para mapear todas as matérias que compõem aquela grade curricular específica.
3. Para cada matéria identificada, o sistema realiza um `INSERT` na tabela associativa `notas`, inicializando os campos de avaliações como vazios (`NULL`) e definindo o campo `situacao` com o estado inicial padrão ('Cursando').

---

## 4. Detalhamento das APIs Obrigatórias

### API 1 - Autenticação de Usuários
* **Endpoint:** `POST /api/login`
* **Regra de Validação:** Consultar exclusivamente a tabela `usuarios` comparando o e-mail informado e validando o hash da senha cadastrada.
* **Estrutura de Retorno Esperada:**
    ```json
    {
      "token": "jwt_token_gerado",
      "usuario": {
        "nome": "Nome do Usuário",
        "perfil": "aluno"
      }
    }
    ```

### API 2 - Cadastro de Dados Acadêmicos
* **Endpoints:**
    * `POST /api/alunos` (Executa a transação tripla: `usuarios` -> `alunos` -> `localizacao`).
    * `POST /api/professores` (Executa a transação dupla: `usuarios` -> `professores`).
    * `POST /api/disciplinas`
* **Comportamento:** Processar as requisições provenientes da aplicação móvel, verificar as permissões do token (apenas 'admin' pode acessar), persistir as informações no PostgreSQL e responder com status correspondente (`201 Created`).

### API 3 - Consulta de Boletim
* **Endpoint:** `GET /api/boletim/:matricula`
* **Operação Relacional:** Realizar uma junção (`JOIN`) unindo a tabela de `alunos` à tabela associativa de `notas` e, consecutivamente, à tabela de `disciplinas` filtrando pela matrícula informada.
* **Estrutura de Retorno Esperada:**
    ```json
    {
      "aluno": "Maria Souza",
      "disciplinas": [
        {
          "disciplina": "Programação Mobile",
          "nota1": 8,
          "nota2": 7,
          "media": 7.5,
          "situacao": "Aprovado"
        }
      ]
    }
    ```

---

## 5. Integração com APIs Externas Obrigatórias

O preenchimento e a validação dos dados de endereço devem ser integrados diretamente com serviços públicos externos para mitigar erros de digitação e padronizar o banco de dados:

1. **API 1 - ViaCEP:** Utilizada para efetuar o preenchimento instantâneo e automatizado dos campos de `endereco`, `cidade` e `estado` logo após o fornecimento do CEP válido no cadastro do aluno.
   * *URL Padrão de Consumo:* `https://viacep.com.br/ws/:cep/json/`
2. **API 2 - IBGE Localidades:** Utilizada para carregar de maneira dinâmica as listagens padronizadas de estados e seus respectivos municípios nos componentes de seleção da interface mobile.
   * *URL Padrão de Consumo (Estados):* `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
