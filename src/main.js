import './style.css';

const modalAdd = document.querySelector("#modalAdd");
const btnAbrirModalAdd = document.querySelector("#btnAbrirModalAdd");
const btnAddTarefa = document.querySelector("#btnAddTarefa"); 
const bodyTabela = document.querySelector("#tabelaTarefas tbody");
const relogio = document.querySelector("#relogio");
const modalExcluir = document.querySelector("#modalExcluir");
const modalConcluir = document.querySelector("#modalConcluir");
const btnConfirmarExclusao = document.querySelector("#btnConfirmarExclusao");
const btnConfirmarConclusao = document.querySelector("#btnConfirmarConclusao");
let linhaSelecionada = null; 
const filtro = document.querySelector("#filtro");
const STORAGE_KEY = "listaTarefas";

function getTarefas() {
    const tarefasJSON = localStorage.getItem(STORAGE_KEY);
    return tarefasJSON ? JSON.parse(tarefasJSON) : [];
}

function saveTarefas(tarefas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function criarLinhaTabela(tarefa) {
    const novaLinha = document.createElement("tr");
    novaLinha.dataset.taskId = tarefa.id;

    if (tarefa.status === "Concluído") {
        novaLinha.style.backgroundColor = "#B7F7C5"; 
        novaLinha.style.textDecoration = "line-through"
    } else {
        novaLinha.style.backgroundColor = "#d4d4d4"; 
    }

    const celulaTitulo = document.createElement("td");
    celulaTitulo.textContent = tarefa.titulo;
    novaLinha.appendChild(celulaTitulo);

    const celulaDescricao = document.createElement("td");
    celulaDescricao.textContent = tarefa.descricao;
    novaLinha.appendChild(celulaDescricao);

    const celulaData = document.createElement("td");
    celulaData.textContent = tarefa.data;
    novaLinha.appendChild(celulaData);

    const celulaStatus = document.createElement("td");
    celulaStatus.textContent = tarefa.status;
    novaLinha.appendChild(celulaStatus);

    const celulaBtns = document.createElement("td");
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "btn-excluir bg-red-400 text-white font-semibold cursor-pointer rounded-lg p-2 mr-2";

    btnExcluir.addEventListener("click", (e) => {
        linhaSelecionada = e.target.closest('tr');
        modalExcluir.showModal();
    });

    const btnConcluir = document.createElement("button");
    btnConcluir.textContent = "Concluir";
    btnConcluir.className = "btn-concluir bg-green-400 text-white font-semibold cursor-pointer rounded-lg p-2";
    
    if (tarefa.status === "Concluído") {
        btnConcluir.disabled = true;
        btnConcluir.style.cursor = "default";
        btnConcluir.style.backgroundColor = "gray";
    }

    btnConcluir.addEventListener("click", (e) => {
        linhaSelecionada = e.target.closest('tr');
        modalConcluir.showModal();
    });

    celulaBtns.appendChild(btnExcluir);
    celulaBtns.appendChild(btnConcluir);
    novaLinha.appendChild(celulaBtns);

    return novaLinha;
}

function loadTarefas() {
    const tarefas = getTarefas();
    tarefas.forEach(tarefa => {
        const novaLinha = criarLinhaTabela(tarefa);
        bodyTabela.appendChild(novaLinha);
    });
}

function attRelogio() {
    const horaAgora = new Date();
    let hr = String(horaAgora.getHours()).padStart(2, "0");
    let min = String(horaAgora.getMinutes()).padStart(2, "0");
    let seg = String(horaAgora.getSeconds()).padStart(2, "0");

    const horario = `${hr}:${min}:${seg}`;
    relogio.textContent = horario;
}

setInterval(attRelogio, 1000);

btnAbrirModalAdd.addEventListener("click", () => {
    document.querySelector("#tituloTarefa").value = "";
    document.querySelector("#descricaoTarefa").value = "";
    modalAdd.showModal();
});

btnAddTarefa.addEventListener("click", (e) => {
    e.preventDefault(); 

    const tituloTarefa = document.querySelector("#tituloTarefa").value.trim();
    const descricaoTarefa = document.querySelector("#descricaoTarefa").value.trim();
    
    if (tituloTarefa === "") {
        alert("Por favor, adicione um título à tarefa.");
        return;
    }

    const dataAtual = new Date();
    const data = dataAtual.toLocaleDateString("pt-br");
    const hora = String(dataAtual.getHours()).padStart(2, "0");
    const minuto = String(dataAtual.getMinutes()).padStart(2, "0");
    const dataCriacao = `[${data}] ${hora}:${minuto}`;
    
    const novaTarefa = {
        id: Date.now(), 
        titulo: tituloTarefa,
        descricao: descricaoTarefa,
        data: dataCriacao,
        status: "Pendente"
    };

    const tarefasAtuais = getTarefas();
    tarefasAtuais.push(novaTarefa);
    saveTarefas(tarefasAtuais);

    const novaLinha = criarLinhaTabela(novaTarefa);
    bodyTabela.appendChild(novaLinha);

    modalAdd.close();
});

btnConfirmarExclusao.addEventListener("click", () => {
    if (linhaSelecionada) {
        const taskId = parseInt(linhaSelecionada.dataset.taskId); 

        linhaSelecionada.remove();
        
        let tarefasAtuais = getTarefas();
        tarefasAtuais = tarefasAtuais.filter(t => t.id !== taskId);
        saveTarefas(tarefasAtuais);

        linhaSelecionada = null;
    }
    modalExcluir.close();
});

btnConfirmarConclusao.addEventListener("click", () => {
    if(linhaSelecionada) {
        const taskId = parseInt(linhaSelecionada.dataset.taskId);
        
        const celulaStatus = linhaSelecionada.children[3]; 
        const btnConcluirMain = linhaSelecionada.children[4].children[1]; 

        celulaStatus.textContent = "Concluído";
        linhaSelecionada.style.backgroundColor = "#B7F7C5"; 
        linhaSelecionada.style.textDecoration = "line-through"; 
        btnConcluirMain.disabled = true;
        btnConcluirMain.style.cursor = "default";
        btnConcluirMain.style.backgroundColor = "gray";
        
        let tarefasAtuais = getTarefas();
        const tarefaIndex = tarefasAtuais.findIndex(t => t.id === taskId);
        
        if (tarefaIndex > -1) {
            tarefasAtuais[tarefaIndex].status = "Concluído";
            saveTarefas(tarefasAtuais);
        }

        linhaSelecionada = null;
    }
    modalConcluir.close();
});

function filtrar() {
    const selecionado = filtro.value;
    const linhas = bodyTabela.querySelectorAll("tr"); 

    linhas.forEach(linha => {
        const status = linha.children[3].textContent.trim(); 
        
        let visivel = false;

        if (selecionado === "todas") {
            visivel = true;
        } 
        else if (selecionado === "pendentes") {
            if (status === "Pendente") {
                visivel = true;
            }
        } 
        else if (selecionado === "concluídas") {
            if (status === "Concluído") {
                visivel = true;
            }
        }

        if (visivel) {
            linha.style.display = ""; 
        } else {
            linha.style.display = "none";
        }
    });
}


filtro.addEventListener("change", filtrar);

loadTarefas();