// Simulando um banco de dados em memória
let alunos = [];
let nextId = 1;

// Funções para manipular os dados
const getAlunos = () => alunos;

const getAlunoById = (id) => {
  const alunoId = parseInt(id);
  return alunos.find(aluno => aluno.id === alunoId);
};

const addAluno = (alunoData) => {
  const novoAluno = {
    id: nextId++,
    ...alunoData
  };
  alunos.push(novoAluno);
  return novoAluno;
};

const updateAluno = (id, alunoData) => {
  const alunoId = parseInt(id);
  const index = alunos.findIndex(aluno => aluno.id === alunoId);
  
  if (index !== -1) {
    alunos[index] = { id: alunoId, ...alunoData };
    return alunos[index];
  }
  
  return null;
};

const deleteAluno = (id) => {
  const alunoId = parseInt(id);
  const index = alunos.findIndex(aluno => aluno.id === alunoId);
  
  if (index !== -1) {
    alunos.splice(index, 1);
    return true;
  }
  
  return false;
};

module.exports = {
  getAlunos,
  getAlunoById,
  addAluno,
  updateAluno,
  deleteAluno
};