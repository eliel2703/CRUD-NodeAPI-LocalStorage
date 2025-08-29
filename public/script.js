document.addEventListener('DOMContentLoaded', () => {
    const alunoForm = document.getElementById('alunoForm');
    const formTitle = document.getElementById('formTitle');
    const alunoId = document.getElementById('alunoId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const alunosList = document.getElementById('alunosList');
    
    let editMode = false;
    
    // Carregar alunos ao iniciar
    carregarAlunos();
    
    // Evento de submit do formulário
    alunoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const aluno = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        matricula: document.getElementById('matricula').value,
        aluno: document.getElementById('aluno').value,
        escola: document.getElementById('escola').value
      };
      
      if (editMode) {
        atualizarAluno(alunoId.value, aluno);
      } else {
        adicionarAluno(aluno);
      }
    });
    
    // Evento do botão cancelar
    cancelBtn.addEventListener('click', () => {
      resetForm();
    });
    
    // Função para carregar alunos
    function carregarAlunos() {
      fetch('/api/alunos')
        .then(response => response.json())
        .then(data => {
          exibirAlunos(data);
          // Também armazena no localStorage
          localStorage.setItem('alunos', JSON.stringify(data));
        })
        .catch(error => {
          console.error('Erro ao carregar alunos:', error);
          // Fallback para localStorage se a API não estiver disponível
          const alunosLocal = localStorage.getItem('alunos');
          if (alunosLocal) {
            exibirAlunos(JSON.parse(alunosLocal));
          }
        });
    }
    
    // Função para exibir alunos na lista
    function exibirAlunos(alunos) {
      alunosList.innerHTML = '';
      
      if (alunos.length === 0) {
        alunosList.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
        return;
      }
      
      alunos.forEach(aluno => {
        const alunoDiv = document.createElement('div');
        alunoDiv.className = 'aluno-item';
        alunoDiv.innerHTML = `
          <p><strong>Nome:</strong> ${aluno.nome}</p>
          <p><strong>CPF:</strong> ${aluno.cpf}</p>
          <p><strong>Telefone:</strong> ${aluno.telefone}</p>
          <p><strong>E-mail:</strong> ${aluno.email}</p>
          <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
          <p><strong>Aluno:</strong> ${aluno.aluno}</p>
          <p><strong>Escola:</strong> ${aluno.escola}</p>
          <div class="aluno-actions">
            <button class="edit-btn" data-id="${aluno.id}">Editar</button>
            <button class="delete-btn" data-id="${aluno.id}">Excluir</button>
          </div>
        `;
        
        alunosList.appendChild(alunoDiv);
      });
      
      // Adicionar eventos aos botões
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          editarAluno(id);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          excluirAluno(id);
        });
      });
    }
    
    // Função para adicionar aluno
    function adicionarAluno(aluno) {
      fetch('/api/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
      })
      .then(response => response.json())
      .then(data => {
        carregarAlunos();
        resetForm();
      })
      .catch(error => {
        console.error('Erro ao adicionar aluno:', error);
        // Fallback para localStorage
        const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
        aluno.id = Date.now(); // ID simples baseado em timestamp
        alunos.push(aluno);
        localStorage.setItem('alunos', JSON.stringify(alunos));
        exibirAlunos(alunos);
        resetForm();
      });
    }
    
    // Função para editar aluno
    function editarAluno(id) {
      fetch(`/api/alunos/${id}`)
        .then(response => response.json())
        .then(aluno => {
          preencherFormulario(aluno);
          editMode = true;
          formTitle.textContent = 'Editar Aluno';
          submitBtn.textContent = 'Atualizar';
          cancelBtn.style.display = 'inline-block';
        })
        .catch(error => {
          console.error('Erro ao carregar aluno para edição:', error);
          // Fallback para localStorage
          const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
          const aluno = alunos.find(a => a.id == id);
          if (aluno) {
            preencherFormulario(aluno);
            editMode = true;
            formTitle.textContent = 'Editar Aluno';
            submitBtn.textContent = 'Atualizar';
            cancelBtn.style.display = 'inline-block';
          }
        });
    }
    
    // Função para atualizar aluno
    function atualizarAluno(id, aluno) {
      fetch(`/api/alunos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
      })
      .then(response => response.json())
      .then(data => {
        carregarAlunos();
        resetForm();
      })
      .catch(error => {
        console.error('Erro ao atualizar aluno:', error);
        // Fallback para localStorage
        const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
        const index = alunos.findIndex(a => a.id == id);
        if (index !== -1) {
          alunos[index] = { id: parseInt(id), ...aluno };
          localStorage.setItem('alunos', JSON.stringify(alunos));
          exibirAlunos(alunos);
          resetForm();
        }
      });
    }
    
    // Função para excluir aluno
    function excluirAluno(id) {
      if (confirm('Tem certeza que deseja excluir este aluno?')) {
        fetch(`/api/alunos/${id}`, {
          method: 'DELETE'
        })
        .then(() => {
          carregarAlunos();
        })
        .catch(error => {
          console.error('Erro ao excluir aluno:', error);
          // Fallback para localStorage
          const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
          const index = alunos.findIndex(a => a.id == id);
          if (index !== -1) {
            alunos.splice(index, 1);
            localStorage.setItem('alunos', JSON.stringify(alunos));
            exibirAlunos(alunos);
          }
        });
      }
    }
    
    // Função para preencher o formulário com dados do aluno
    function preencherFormulario(aluno) {
      document.getElementById('nome').value = aluno.nome;
      document.getElementById('cpf').value = aluno.cpf;
      document.getElementById('telefone').value = aluno.telefone;
      document.getElementById('email').value = aluno.email;
      document.getElementById('matricula').value = aluno.matricula;
      document.getElementById('aluno').value = aluno.aluno;
      document.getElementById('escola').value = aluno.escola;
      alunoId.value = aluno.id;
    }
    
    // Função para resetar o formulário
    function resetForm() {
      alunoForm.reset();
      alunoId.value = '';
      editMode = false;
      formTitle.textContent = 'Adicionar Novo Aluno';
      submitBtn.textContent = 'Salvar';
      cancelBtn.style.display = 'none';
    }
  });