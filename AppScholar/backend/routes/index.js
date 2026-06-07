const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const alunoRoutes = require('./alunoRoutes');
const professorRoutes = require('./professorRoutes');
const disciplinaRoutes = require('./disciplinaRoutes');
const boletimRoutes = require('./boletimRoutes');

router.use('/auth', authRoutes);
router.use('/alunos', alunoRoutes);
router.use('/professores', professorRoutes);
router.use('/disciplinas', disciplinaRoutes);
router.use('/boletins', boletimRoutes);

module.exports = router;
