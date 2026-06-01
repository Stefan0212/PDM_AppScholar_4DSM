const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// POST /api/alunos
router.post('/', alunoController.cadastrarAluno);

module.exports = router;
