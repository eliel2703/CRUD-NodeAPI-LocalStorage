const express = require('express');
const router = express.Router();
const { 
  getAlunos, 
  getAlunoById, 
  addAluno, 
  updateAluno, 
  deleteAluno 
} = require('../dados/database');

// GET - Listar todos os alunos
router.get('/', (req, res) => {
  const alunos = getAlunos();
  res.json(alunos);
});

// GET - Obter um aluno específico por ID
router.get('/:id', (req, res) => {
  const aluno = getAlunoById(req.params.id);
  if (aluno) {
    res.json(aluno);
  } else {
    res.status(404).json({ error: 'Aluno não encontrado' });
  }
});

// POST - Adicionar um novo aluno
router.post('/', (req, res) => {
  const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
  
  if (!nome || !cpf || !telefone || !email || !matricula || !aluno || !escola) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  const novoAluno = addAluno({ nome, cpf, telefone, email, matricula, aluno, escola });
  res.status(201).json(novoAluno);
});

// PUT - Atualizar um aluno existente
router.put('/:id', (req, res) => {
  const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
  
  if (!nome || !cpf || !telefone || !email || !matricula || !aluno || !escola) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  const alunoAtualizado = updateAluno(req.params.id, { nome, cpf, telefone, email, matricula, aluno, escola });
  
  if (alunoAtualizado) {
    res.json(alunoAtualizado);
  } else {
    res.status(404).json({ error: 'Aluno não encontrado' });
  }
});

// DELETE - Remover um aluno
router.delete('/:id', (req, res) => {
  const sucesso = deleteAluno(req.params.id);
  
  if (sucesso) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Aluno não encontrado' });
  }
});

module.exports = router;