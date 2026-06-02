const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

// POST /api/professores
router.post('/', professorController.cadastrarProfessor);

// GET /api/professores
router.get('/', professorController.listarProfessores);

// GET /api/professores/:id_usuario/disciplinas
router.get('/:id_usuario/disciplinas', professorController.getDisciplinasProfessor);

module.exports = router;
