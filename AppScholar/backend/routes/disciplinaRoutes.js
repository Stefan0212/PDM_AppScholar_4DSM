const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');

// POST /api/disciplinas
router.post('/', disciplinaController.cadastrarDisciplina);

// GET /api/disciplinas/:id_disciplina/alunos
router.get('/:id_disciplina/alunos', disciplinaController.getAlunosDisciplina);

module.exports = router;
