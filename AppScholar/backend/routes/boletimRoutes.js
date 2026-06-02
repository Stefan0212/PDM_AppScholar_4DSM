const express = require('express');
const router = express.Router();
const boletimController = require('../controllers/boletimController');

// POST /api/boletins/matricula -> Matricula direta (nova lógica)
router.post('/matricula', boletimController.matricularAluno);

// GET /api/boletins/:matricula -> Consulta o boletim do aluno
router.get('/:matricula', boletimController.consultarBoletim);

// PUT /api/boletins/nota/:id_nota -> Atualiza as notas (nota1, nota2) e situação do aluno
router.put('/nota/:id_nota', boletimController.atualizarNota);

module.exports = router;