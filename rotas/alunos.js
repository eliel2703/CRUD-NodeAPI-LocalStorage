const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { 
  getAlunos, 
  getAlunoById, 
  addAluno, 
  updateAluno, 
  deleteAluno 
} = require('../dados/database');

// Chave secreta para JWT (em produção, use uma variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui';

// Middleware para verificar o token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'Token de acesso não fornecido' });
  }
  
  try {
    // Remove o "Bearer " do token se presente
    const tokenLimpo = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenLimpo, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Rota de login para obter token
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  
  // Em uma aplicação real, você validaria contra um banco de dados
  const usuarioValido = validarUsuario(usuario, senha);
  
  if (!usuarioValido) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  
  // Criar token JWT (expira em 24 horas)
  const token = jwt.sign(
    { 
      id: usuarioValido.id, 
      usuario: usuarioValido.usuario,
      role: usuarioValido.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.json({ 
    token,
    usuario: {
      id: usuarioValido.id,
      usuario: usuarioValido.usuario,
      role: usuarioValido.role
    }
  });
});

// GET - Listar todos os alunos (protegido)
router.get('/', verificarToken, (req, res) => {
  const alunos = getAlunos();
  res.json(alunos);
});

// GET - Obter um aluno específico por ID (protegido)
router.get('/:id', verificarToken, (req, res) => {
  const aluno = getAlunoById(req.params.id);
  if (aluno) {
    res.json(aluno);
  } else {
    res.status(404).json({ error: 'Aluno não encontrado' });
  }
});

// POST - Adicionar um novo aluno (protegido)
router.post('/', verificarToken, (req, res) => {
  const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
  
  if (!nome || !cpf || !telefone || !email || !matricula || !aluno || !escola) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  const novoAluno = addAluno({ nome, cpf, telefone, email, matricula, aluno, escola });
  res.status(201).json(novoAluno);
});

// PUT - Atualizar um aluno existente (protegido)
router.put('/:id', verificarToken, (req, res) => {
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

// DELETE - Remover um aluno (protegido)
router.delete('/:id', verificarToken, (req, res) => {
  const sucesso = deleteAluno(req.params.id);
  
  if (sucesso) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Aluno não encontrado' });
  }
});

// Função para validar usuário (substitua pela sua lógica real)
function validarUsuario(usuario, senha) {
  // Exemplo simples - em produção, consulte o banco de dados
  const usuarios = [
    { id: 1, usuario: 'admin', senha: 'admin123', role: 'admin' },
    { id: 2, usuario: 'professor', senha: 'prof123', role: 'professor' }
  ];
  
  return usuarios.find(u => u.usuario === usuario && u.senha === senha);
}

module.exports = router;
