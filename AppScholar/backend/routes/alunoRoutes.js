const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// POST /api/alunos
router.post('/', alunoController.cadastrarAluno);

// GET /api/alunos
router.get('/', alunoController.listarAlunos);

module.exports = router;
