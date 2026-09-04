(() => {
    'use strict';

    const CHAVE_USUARIO = 'smartcontrol_usuario';
    const CHAVE_TEMA = 'smartcontrol_tema';

    function obterUsuario() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE_USUARIO));
            return dados && typeof dados === 'object' ? dados : null;
        } catch (erro) {
            console.warn('Não foi possível ler o usuário salvo.', erro);
            return null;
        }
    }

    function fecharMenuLateral() {
        const botao = document.getElementById('menu-toggle');
        const menu = document.getElementById('side-menu');
        const overlay = document.getElementById('menu-overlay');
        if (!botao || !menu) return;

        botao.classList.remove('is-active');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        overlay?.classList.remove('open');
    }

    function alternarMenuLateral() {
        const botao = document.getElementById('menu-toggle');
        const menu = document.getElementById('side-menu');
        const overlay = document.getElementById('menu-overlay');
        if (!botao || !menu) return;

        const aberto = menu.classList.contains('open');
        botao.classList.toggle('is-active', !aberto);
        botao.setAttribute('aria-expanded', String(!aberto));
        botao.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
        menu.classList.toggle('open', !aberto);
        menu.setAttribute('aria-hidden', String(aberto));
        overlay?.classList.toggle('open', !aberto);
    }

    function configurarMenuLateral() {
        const botao = document.getElementById('menu-toggle');
        const overlay = document.getElementById('menu-overlay');

        botao?.addEventListener('click', (evento) => {
            evento.stopPropagation();
            alternarMenuLateral();
        });
        overlay?.addEventListener('click', fecharMenuLateral);

        document.querySelectorAll('.side-link').forEach((link) => {
            link.addEventListener('click', () => fecharMenuLateral());
        });
    }

    function configurarPerfil(usuario) {
        const profileToggle = document.getElementById('profile-toggle');
        const profileMenu = document.getElementById('profile-menu');
        const nomeSpan = document.getElementById('profile-username');

        if (usuario) {
            const nome = String(usuario.nome || usuario.email || 'Visitante').trim();
            const primeiroNome = nome.split(/\s+/)[0] || 'Visitante';
            const inicial = nome.charAt(0).toUpperCase() || 'U';
            if (nomeSpan) nomeSpan.textContent = primeiroNome;
            if (profileToggle) profileToggle.textContent = inicial;
        }

        profileToggle?.addEventListener('click', (evento) => {
            evento.stopPropagation();
            const aberto = profileMenu?.classList.contains('open');
            profileMenu?.classList.toggle('open', !aberto);
            profileToggle.setAttribute('aria-expanded', String(!aberto));
        });

        document.addEventListener('click', (evento) => {
            if (profileMenu && profileToggle && !profileMenu.contains(evento.target) && !profileToggle.contains(evento.target)) {
                profileMenu.classList.remove('open');
                profileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.getElementById('logout-link')?.addEventListener('click', () => {
            localStorage.removeItem(CHAVE_USUARIO);
        });
    }

    function configurarTema() {
        const raiz = document.documentElement;
        const toggle = document.getElementById('theme-toggle');
        const temaSalvo = localStorage.getItem(CHAVE_TEMA) === 'dark' ? 'dark' : 'light';

        function aplicarTema(tema) {
            const temaSeguro = tema === 'dark' ? 'dark' : 'light';
            raiz.setAttribute('data-theme', temaSeguro);
            if (toggle) toggle.checked = temaSeguro === 'dark';
            localStorage.setItem(CHAVE_TEMA, temaSeguro);
        }

        aplicarTema(temaSalvo);
        toggle?.addEventListener('change', () => aplicarTema(toggle.checked ? 'dark' : 'light'));
    }

    function protegerDashboard(usuario) {
        const pagina = window.location.pathname.split('/').pop().toLowerCase();
        if (pagina === 'dashboard.html' && !usuario) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const usuario = obterUsuario();
        if (protegerDashboard(usuario)) return;
        configurarMenuLateral();
        configurarPerfil(usuario);
        configurarTema();
    });

    window.SmartControl = Object.freeze({
        obterUsuario,
        CHAVE_USUARIO,
        CHAVE_TEMA
    });
})();
