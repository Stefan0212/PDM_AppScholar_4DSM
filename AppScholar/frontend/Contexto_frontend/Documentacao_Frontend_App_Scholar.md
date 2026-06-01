# Documentação de Desenvolvimento Frontend - App Scholar (Mobile)

**Instituição:** Fatec Jacareí
**Professor:** André Olímpio
**Disciplina:** Programação para Dispositivos Móveis I
**Projeto:** Aplicativo Mobile de Gerenciamento de Boletim Acadêmico

---

## 1. Visão Geral e Stack Tecnológica

O frontend será o aplicativo mobile multiplataforma responsável pela interface com o usuário (UI) e experiência (UX). Ele consumirá a API REST em Node.js (backend) e as APIs externas (ViaCEP e IBGE).

* **Framework Principal:** React Native com Expo.dev.
* **Linguagem:** JavaScript ou TypeScript.
* **Roteamento:** React Navigation.
* **Requisições HTTP:** Axios ou Fetch API (recomendado Axios para padronização).
* **Gerenciamento de Estado:** Hooks nativos do React (`useState`, `useEffect`, `useContext`).

---

## 2. Estrutura de Pastas Sugerida

Para manter o código organizado e escalável, a estrutura do diretório `/src` deve seguir o seguinte padrão:

* `/src`
  * `/components` -> *Componentes visuais reutilizáveis (Botões customizados, Inputs, Cards, Headers).*
  * `/screens` -> *As telas completas da aplicação.*
  * `/services` -> *Configuração do Axios e chamadas para a API (ex: `api.js`, `viacep.js`).*
  * `/hooks` -> *Hooks customizados (ex: `useAuth` para gerenciar o contexto de login).*
  * `/styles` -> *Estilos globais, paleta de cores e tipografia.*
  * `/navigation` -> *Configuração das rotas e Stacks do React Navigation.*

---

## 3. Padrões de UI/UX e Boas Práticas

O desenvolvimento visual deve focar em:
* Layout limpo, organizado e legível.
* Navegação intuitiva entre as telas.
* Feedback visual para o usuário (ex: ActivityIndicator/Spinners durante carregamentos, Toasts de sucesso/erro).
* Validação de formulários antes do envio para a API (campos vazios, formato de email, etc.).
* Padronização visual através da criação de componentes base (ex: `<CustomInput />`, `<PrimaryButton />`).

---

## 4. Telas Obrigatórias e Requisitos

3. Arquitetura de Telas por Perfil de Usuário
A. Tela Global (Ponto de Entrada)
Tela de Login: Acessível a todos. Contém os campos email e senha. Ao clicar em entrar, consome o endpoint POST /api/login.

Lógica de Redirecionamento: O Contexto de Autenticação avalia o campo perfil retornado pelo backend ('admin', 'professor' ou 'aluno') e chaveia a pilha de navegação do aplicativo para o ecossistema correspondente.

B. Fluxo do Administrador (Admin / Secretaria)
Interface voltada à gestão global da instituição, cadastros estruturais e movimentações de alunos.

Dashboard Admin: Menu principal com cards de navegação rápida para as funções de gerenciamento e relatórios do sistema.

Tela de Cadastro de Alunos: Formulário para capturar dados pessoais (Nome, Matrícula, Curso, Telefone).

Automação de CEP: Possui o campo CEP que, ao perder o foco (onBlur), consome a API do ViaCEP e autopreenche os campos de endereço (Rua, Cidade, Estado) salvando os dados na tabela normalizada de localização.

Tela de Cadastro de Professores: Formulário para inserção de dados profissionais do docente (Nome, Titulação, Área de atuação, Tempo de docência).

Tela de Cadastro de Disciplinas: Formulário para criar novas matérias, coletando Nome, Carga Horária, Curso, Semestre e um Dropdown/Picker contendo a lista de professores ativos (buscada previamente no backend).

Tela de Matrícula (Vincular Aluno à Disciplina): Tela inteligente para alocação do aluno. O Admin seleciona o aluno, o curso e o semestre. O app dispara a requisição de matrícula em lote para o backend, que preenche a tabela de notas automaticamente com o status inicial 'Cursando'.

C. Fluxo do Professor
Interface focada no acompanhamento pedagógico e alimentação do banco de dados acadêmico.

Dashboard Professor: Tela de boas-vindas exibindo os dados do docente e atalhos para suas turmas.

Tela de Minhas Disciplinas e Alunos: Lista todas as matérias que o id_professor atual leciona. Ao clicar em uma disciplina, abre a listagem dos alunos que estão vinculados àquela matéria (dados obtidos cruzando a tabela notas e alunos).

Tela de Lançamento de Notas: Ao selecionar um aluno específico na listagem da turma, abre-se um modal ou tela com os campos de input para Nota 1 e Nota 2. Ao salvar, dispara uma requisição de atualização para o backend, calculando a média e atualizando a situação (Aprovado/Reprovado/Cursando).

D. Fluxo do Aluno
Interface simplificada e de consulta, focada estritamente na visualização de dados individuais.

Dashboard Aluno: Apresenta avisos institucionais e o botão principal para acessar a área de desempenho acadêmico.

Tela de Visualização de Boletim: Exibe a listagem completa de todas as disciplinas nas quais o aluno está ou esteve matriculado (consumindo GET /api/boletim/:matricula).

Diferencial de UX: Utilização de uma FlatList renderizando cartões customizados. A situação do aluno deve mudar de cor dinamicamente (Verde para Aprovado, Vermelho para Reprovado, Amarelo para Cursando).

4. Consumo de APIs Externas e Regras Visuais
ViaCEP (https://viacep.com.br/ws/:cep/json/): Deve ser disparada de forma assíncrona na tela de cadastro do aluno. Enquanto a busca acontece, os inputs de endereço devem exibir um estado de carregamento (ActivityIndicator) ou ficarem desabilitados para evitar escrita manual incorreta.

IBGE Localidades (https://servicodados.ibge.gov.br/api/v1/localidades/estados): Utilizada opcionalmente para popular de forma padronizada os seletores de Estado/Cidade nos formulários de endereço do administrador.

Feedbacks Visuais Obrigatórios: Qualquer operação de cadastro ou lançamento de notas deve exibir um alerta visual claro (Toast ou Modal de Sucesso) e limpar os campos do formulário após a consolidação dos dados no banco.

---

## 5. Gerenciamento de Estado (Hooks Obrigatórios)

* **`useState`:** Para controlar o valor de todos os inputs de formulário e dados em tela (ex: listas de disciplinas).
* **`useEffect`:** Para disparar chamadas de API assim que uma tela carregar (ex: buscar boletim ao abrir a tela de visualização) ou para monitorar mudanças (ex: autocompletar CEP).
* **`useContext`:** Para criar um Contexto Global de Autenticação (`AuthContext`). Isso evitará a necessidade de passar o token JWT como prop manualmente por todas as telas, facilitando a inclusão do token no cabeçalho (Header) das requisições feitas pelo Axios.

