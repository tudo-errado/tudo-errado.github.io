let nomeUser = prompt("qual é o seu nome?")
const DATA_ATUAL = new Date();
const HORA_ATUAL = DATA_ATUAL.toLocaleTimeString();

const DADOS_USUARIO = {
    nome: nomeUser,
    hora: HORA_ATUAL,
    data: DATA_ATUAL,
}

console.log(`Olá ${DADOS_USUARIO.nome}, hoje é ${DATA_ATUAL.toLocaleDateString()} -- ${HORA_ATUAL}.`)