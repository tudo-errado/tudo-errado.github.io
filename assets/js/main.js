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

    document.getElementById('add-device')?.addEventListener('click', () => {
        mostrarToast('Funcionalidade em desenvolvimento.');
    });

    document.querySelectorAll('.room-card .switch').forEach(sw => {
        sw.parentElement?.addEventListener('click', (e) => {
            e.stopPropagation();
            sw.classList.toggle('on');
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

});
