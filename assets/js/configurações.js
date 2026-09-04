(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const botaoMenu = document.getElementById('menu-toggle');
        const menu = document.getElementById('menu-configuracoes');

        botaoMenu?.addEventListener('click', () => {
            menu?.classList.toggle('aberto');
            botaoMenu.classList.toggle('is-active');
        });

        document.querySelectorAll('.item-menu').forEach((item) => {
            item.addEventListener('click', () => menu?.classList.remove('aberto'));
        });

        const configuracoesPrivacidade = [
            ['permitir-rastreamento', 'permitirRastreamento'],
            ['ocultar-ip', 'ocultarIP'],
            ['sincronizar', 'sincronizarDispositivos']
        ];

        configuracoesPrivacidade.forEach(([id, chave]) => {
            const campo = document.getElementById(id);
            if (!campo) return;

            campo.checked = localStorage.getItem(chave) === 'true';
            campo.addEventListener('change', () => {
                localStorage.setItem(chave, String(campo.checked));
            });
        });

        async function gerarHash(texto) {
            const dados = new TextEncoder().encode(texto);
            const hash = await crypto.subtle.digest('SHA-256', dados);
            return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
        }

        const botaoAlterarSenha = document.getElementById('alterar-senha');
        botaoAlterarSenha?.addEventListener('click', async () => {
            const senhaAtual = document.getElementById('senha-atual');
            const novaSenha = document.getElementById('nova-senha');
            const confirmarSenha = document.getElementById('confirmar-senha');

            if (!senhaAtual || !novaSenha || !confirmarSenha) return;

            if (!senhaAtual.value || !novaSenha.value || !confirmarSenha.value) {
                window.alert('Preencha todos os campos.');
                return;
            }

            if (novaSenha.value.length !== 8) {
                window.alert('A nova senha deve ter exatamente 8 caracteres.');
                return;
            }

            if (novaSenha.value !== confirmarSenha.value) {
                window.alert('As senhas não são iguais.');
                return;
            }

            try {
                const usuario = JSON.parse(localStorage.getItem('smartcontrol_usuario') || 'null');
                if (!usuario?.senhaHash) {
                    window.alert('Nenhuma conta cadastrada foi encontrada.');
                    return;
                }

                const hashAtual = await gerarHash(senhaAtual.value);
                if (hashAtual !== usuario.senhaHash) {
                    window.alert('A senha atual está incorreta.');
                    return;
                }

                usuario.senhaHash = await gerarHash(novaSenha.value);
                localStorage.setItem('smartcontrol_usuario', JSON.stringify(usuario));
                localStorage.setItem('senhaAlterada', 'true');

                window.alert('Senha alterada com sucesso!');
                senhaAtual.value = '';
                novaSenha.value = '';
                confirmarSenha.value = '';
            } catch (erro) {
                console.error('Erro ao alterar a senha.', erro);
                window.alert('Não foi possível alterar a senha. Tente novamente.');
            }
        });
    });
})();
