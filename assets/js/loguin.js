(() => {
    'use strict';

    const CHAVE_USUARIO = 'smartcontrol_usuario';

    async function gerarHash(texto) {
        const dados = new TextEncoder().encode(texto);
        const hash = await crypto.subtle.digest('SHA-256', dados);
        return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    function obterUsuario() {
        try { return JSON.parse(localStorage.getItem(CHAVE_USUARIO) || 'null'); }
        catch (erro) { return null; }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const formulario = document.getElementById('login-form');
        const mensagem = document.getElementById('login-erro');
        if (!formulario) return;

        formulario.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            if (mensagem) mensagem.textContent = '';

            const usuario = obterUsuario();
            const email = document.getElementById('login-email')?.value.trim().toLowerCase() || '';
            const senha = document.getElementById('login-senha')?.value || '';

            if (!usuario) {
                if (mensagem) mensagem.textContent = 'Você ainda não possui uma conta. Crie uma primeiro.';
                return;
            }

            try {
                const senhaHash = await gerarHash(senha);
                if (usuario.email !== email || usuario.senhaHash !== senhaHash) {
                    if (mensagem) mensagem.textContent = 'E-mail ou senha incorretos.';
                    return;
                }
                window.location.href = 'dashboard.html';
            } catch (erro) {
                console.error(erro);
                if (mensagem) mensagem.textContent = 'Não foi possível realizar o login.';
            }
        });
    });
})();
