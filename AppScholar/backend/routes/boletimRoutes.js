const express = require('express');
const router = express.Router();
const boletimController = require('../controllers/boletimController');

// POST /api/boletins/matricula -> Aloca um aluno em várias disciplinas
router.post('/matricula', boletimController.matricularSemestre);

// GET /api/boletins/:matricula -> Consulta o boletim do aluno
router.get('/:matricula', boletimController.consultarBoletim);

// PUT /api/boletins/nota/:id_nota -> Atualiza as notas (N1, N2) e situação do aluno
router.put('/nota/:id_nota', boletimController.atualizarNota);

module.exports = router;
