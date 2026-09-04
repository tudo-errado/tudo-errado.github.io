(() => {
    'use strict';

    const CHAVE_USUARIO = 'smartcontrol_usuario';

    async function gerarHash(texto) {
        const dados = new TextEncoder().encode(texto);
        const hash = await crypto.subtle.digest('SHA-256', dados);
        return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const formulario = document.getElementById('cadastro-form');
        const mensagem = document.getElementById('cadastro-erro');
        if (!formulario) return;

        formulario.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            if (mensagem) mensagem.textContent = '';

            const nome = document.getElementById('nome_completo')?.value.trim() || '';
            const email = document.getElementById('cadastro-email')?.value.trim().toLowerCase() || '';
            const senha = document.getElementById('cadastro-senha')?.value || '';
            const confirmar = document.getElementById('confirmar-senha')?.value || '';

            if (nome.length < 2) {
                if (mensagem) mensagem.textContent = 'Digite seu nome completo.';
                return;
            }
            if (senha.length !== 8) {
                if (mensagem) mensagem.textContent = 'A senha deve ter exatamente 8 caracteres.';
                return;
            }
            if (senha !== confirmar) {
                if (mensagem) mensagem.textContent = 'As senhas não coincidem.';
                return;
            }

            try {
                const senhaHash = await gerarHash(senha);
                localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ nome, email, senhaHash }));
                window.location.href = 'dashboard.html';
            } catch (erro) {
                console.error(erro);
                if (mensagem) mensagem.textContent = 'Não foi possível salvar a conta. Tente novamente.';
            }
        });
    });
})();
