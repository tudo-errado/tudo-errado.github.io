document.addEventListener('DOMContentLoaded', () => {

    const CHAVE_USUARIO = 'smartcontrol_usuario';

    function obterUsuario() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_USUARIO));
        } catch (e) {
            return null;
        }
    }

    const paginaAtual = location.pathname.split('/').pop();
    const usuario = obterUsuario();


    if (paginaAtual === 'dashboard.html' && !usuario) {
        window.location.href = 'index.html';
        return;
    }

    if (usuario) {
        const nomeExibicao = usuario.nome || usuario.email || 'Visitante';
        const primeiroNome = nomeExibicao.trim().split(' ')[0];
        const inicial = nomeExibicao.trim().charAt(0).toUpperCase() || 'U';

        const nomeSpan = document.getElementById('profile-username');
        if (nomeSpan) nomeSpan.textContent = primeiroNome;

        const avatar = document.getElementById('profile-toggle');
        if (avatar) avatar.textContent = inicial;
    }

    /* menu esquerda */
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    function fecharMenu() {
        if (!menuToggle || !sideMenu) return;
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        sideMenu.classList.remove('open');
        sideMenu.setAttribute('aria-hidden', 'true');
        menuOverlay?.classList.remove('open');
    }

    function abrirMenu() {
        if (!menuToggle || !sideMenu) return;
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
        sideMenu.classList.add('open');
        sideMenu.setAttribute('aria-hidden', 'false');
        menuOverlay?.classList.add('open');
    }

    menuToggle?.addEventListener('click', () => {
        const aberto = sideMenu?.classList.contains('open');
        aberto ? fecharMenu() : abrirMenu();
    });

    menuOverlay?.addEventListener('click', fecharMenu);

    document.querySelectorAll('.side-link').forEach(link => {
        link.addEventListener('click', (e) => {
            document.querySelectorAll('.side-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const pagina = link.dataset.page;
            const titulo = document.querySelector('.page-title');
            if (titulo) titulo.textContent = link.querySelector('span:last-child')?.textContent || 'Início';

            if (pagina && pagina !== 'inicio') {
                e.preventDefault();
                mostrarToast('Em breve: ' + link.textContent.trim());
            }
            fecharMenu();
        });
    });

    /* menu direita*/
    const profileToggle = document.getElementById('profile-toggle');
    const profileMenu = document.getElementById('profile-menu');

    function fecharPerfil() {
        profileMenu?.classList.remove('open');
        profileToggle?.setAttribute('aria-expanded', 'false');
    }

    function alternarPerfil() {
        const aberto = profileMenu?.classList.contains('open');
        if (aberto) {
            fecharPerfil();
        } else {
            profileMenu?.classList.add('open');
            profileToggle?.setAttribute('aria-expanded', 'true');
        }
    }

    profileToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        alternarPerfil();
    });

    document.addEventListener('click', (e) => {
        if (profileMenu && !profileMenu.contains(e.target) && e.target !== profileToggle) {
            fecharPerfil();
        }
    });

    document.getElementById('logout-link')?.addEventListener('click', () => {
        localStorage.removeItem(CHAVE_USUARIO);
    });

    /* tema claro e escuro */
    const CHAVE_TEMA = 'smartcontrol_tema';
    const themeToggle = document.getElementById('theme-toggle');
    const raiz = document.documentElement;

    function aplicarTema(tema) {
        raiz.setAttribute('data-theme', tema);
        if (themeToggle) themeToggle.checked = tema === 'dark';
        localStorage.setItem(CHAVE_TEMA, tema);
    }

    aplicarTema(localStorage.getItem(CHAVE_TEMA) === 'dark' ? 'dark' : 'light');

    themeToggle?.addEventListener('change', () => {
        aplicarTema(themeToggle.checked ? 'dark' : 'light');
    });

    const campoBusca = document.getElementById('card-search');
    const limparBusca = document.getElementById('clear-search');
    const semResultados = document.getElementById('no-results');
    const cartoesBuscaveis = document.querySelectorAll('.searchable-card');

    function filtrarCartoes() {
        const termo = (campoBusca?.value || '').trim().toLowerCase();
        let algumVisivel = false;

        cartoesBuscaveis.forEach(cartao => {
            const conteudo = (cartao.dataset.search || cartao.textContent || '').toLowerCase();
            const visivel = !termo || conteudo.includes(termo);
            cartao.style.display = visivel ? '' : 'none';
            if (visivel) algumVisivel = true;
        });

        if (semResultados) semResultados.hidden = algumVisivel || !termo;
    }

    campoBusca?.addEventListener('input', filtrarCartoes);
    limparBusca?.addEventListener('click', () => {
        if (campoBusca) campoBusca.value = '';
        filtrarCartoes();
        campoBusca?.focus();
    });

    /* ambientes: estado ligado/desligado + visual persistente */
    const CHAVE_AMBIENTES = 'smartcontrol_ambientes';
    const cartoesAmbientes = document.querySelectorAll('.room-card');

    function obterEstadosAmbientes() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_AMBIENTES)) || {};
        } catch (e) {
            return {};
        }
    }

    function salvarEstadosAmbientes(estados) {
        localStorage.setItem(CHAVE_AMBIENTES, JSON.stringify(estados));
    }

    const estadosAmbientes = obterEstadosAmbientes();

    cartoesAmbientes.forEach((card, indice) => {
        const sw = card.querySelector('.switch');
        const nome = card.querySelector('b')?.textContent.trim() || `ambiente-${indice}`;
        const estadoSalvo = Object.prototype.hasOwnProperty.call(estadosAmbientes, nome)
            ? Boolean(estadosAmbientes[nome])
            : card.classList.contains('active') || sw?.classList.contains('on');

        card.classList.toggle('active', estadoSalvo);
        sw?.classList.toggle('on', estadoSalvo);

        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const novoEstado = !card.classList.contains('active');
            card.classList.toggle('active', novoEstado);
            sw?.classList.toggle('on', novoEstado);

            estadosAmbientes[nome] = novoEstado;
            salvarEstadosAmbientes(estadosAmbientes);
        });
    });

    let toastTimer = null;
    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = mensagem;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    /* dispositivos */
    const botaoAdicionarDispositivo = document.getElementById('adicionar-dispositivo');
    const listaDispositivos = document.getElementById('lista-dispositivos');
    const CHAVE_DISPOSITIVOS = 'smartcontrol_dispositivos';

    function obterDispositivos() {
        try { const dados = JSON.parse(localStorage.getItem(CHAVE_DISPOSITIVOS)); return Array.isArray(dados) ? dados : []; }
        catch (e) { return []; }
    }
    function salvarDispositivos(dispositivos) { localStorage.setItem(CHAVE_DISPOSITIVOS, JSON.stringify(dispositivos)); }
    function criarItemDispositivo(nome) {
        const item=document.createElement('button'); item.type='button'; item.className='item-dispositivo';
        item.innerHTML='<span class="icone-dispositivo" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg></span><span class="nome-dispositivo"></span>';
        item.querySelector('.nome-dispositivo').textContent=nome; return item;
    }
    if (listaDispositivos) obterDispositivos().forEach(nome => listaDispositivos.appendChild(criarItemDispositivo(nome)));
    botaoAdicionarDispositivo?.addEventListener('click', () => {
        const nomeLimpo=(prompt('Digite o nome do dispositivo:') || '').trim();
        if (!nomeLimpo || !listaDispositivos) return;
        listaDispositivos.appendChild(criarItemDispositivo(nomeLimpo));
        const dispositivos=obterDispositivos(); dispositivos.push(nomeLimpo); salvarDispositivos(dispositivos);
    });

    /* conexões */
    document.getElementById('adicionar-conta')?.addEventListener('click', () => {
        const nome = prompt('Digite o nome da conta:');
        if (!nome || !nome.trim()) return;
        const lista = document.querySelector('.lista-conexoes');
        if (!lista) return;
        const item = document.createElement('div');
        item.className = 'item-conexao';
        item.innerHTML = `<div class="avatar-conexao">◉</div><div class="informacoes-conexao"><span class="nome-conexao"></span><small>Membro</small></div>`;
        item.querySelector('.nome-conexao').textContent = nome.trim();
        lista.appendChild(item);
    });

    /* =========================
   CENAS
========================= */

const adicionarCena = document.getElementById("adicionar-cena");
const minhasCenas = document.getElementById("minhas-cenas");
const menuCenas = document.getElementById("menu-cenas");
const listaCenas = document.getElementById("lista-cenas");


// Recupera as cenas salvas
let cenasSalvas = JSON.parse(
    localStorage.getItem("cenasSmartControl") || "[]"
);


// Atualiza a lista
function atualizarListaCenas() {

    if (!listaCenas) return;

    listaCenas.innerHTML = "";

    cenasSalvas.forEach(cena => {

        const item = document.createElement("div");

        item.className = "item-cena";

        item.textContent = cena;

        listaCenas.appendChild(item);

    });
}


// Abrir/fechar menu "Adicionar cena"
if (adicionarCena && menuCenas) {

    adicionarCena.addEventListener("click", function () {

        menuCenas.classList.toggle("aberto");

        const seta = adicionarCena.querySelector(".seta-cena");

        if (seta) {
            seta.style.transform =
                menuCenas.classList.contains("aberto")
                    ? "rotate(180deg)"
                    : "rotate(0deg)";
        }

    });


    // Selecionar uma cena
    menuCenas.querySelectorAll("button").forEach(botao => {

        botao.addEventListener("click", function (evento) {

            evento.stopPropagation();

            const nomeCena = this.dataset.cena;

            if (!nomeCena) return;


            // Evita duplicar cenas
            if (!cenasSalvas.includes(nomeCena)) {

                cenasSalvas.push(nomeCena);

                localStorage.setItem(
                    "cenasSmartControl",
                    JSON.stringify(cenasSalvas)
                );

            }


            atualizarListaCenas();

            menuCenas.classList.remove("aberto");

            const seta = adicionarCena.querySelector(".seta-cena");

            if (seta) {
                seta.style.transform = "rotate(0deg)";
            }

        });

    });

}


// Abrir/fechar "Minhas cenas"
if (minhasCenas && listaCenas) {

    minhasCenas.addEventListener("click", function () {

        listaCenas.classList.toggle("aberta");

        const seta = minhasCenas.querySelector(".seta-cena");

        if (seta) {

            seta.style.transform =
                listaCenas.classList.contains("aberta")
                    ? "rotate(180deg)"
                    : "rotate(0deg)";

        }

    });

}


// Carrega as cenas quando a página abre
atualizarListaCenas();
});
