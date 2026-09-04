(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const botaoMenu = document.getElementById('botao-menu');
        const menuLateral = document.getElementById('menu-lateral');
        const botaoVoltar = document.getElementById('botao-voltar');

        botaoMenu?.addEventListener('click', () => menuLateral?.classList.toggle('aberto'));

        botaoVoltar?.addEventListener('click', () => {
            if (window.history.length > 1) window.history.back();
            else window.location.href = 'dashboard.html';
        });

        const campoBio = document.getElementById('campo-bio');
        const campoEmail = document.getElementById('campo-email');
        const campoTelefone = document.getElementById('campo-telefone');
        const visualizarDados = document.getElementById('visualizar-dados');
        const convitesAutomaticos = document.getElementById('convites-automaticos');
        const botaoSalvar = document.getElementById('botao-salvar');
        const botaoEditarNome = document.getElementById('botao-editar-nome');
        const nomeUsuario = document.getElementById('nome-usuario');
        const botaoImagem = document.getElementById('botao-imagem');

        const usuario = (() => {
            try { return JSON.parse(localStorage.getItem('smartcontrol_usuario') || 'null'); }
            catch (erro) { return null; }
        })();

        if (usuario) {
            if (campoEmail && usuario.email) campoEmail.value = usuario.email;
            if (nomeUsuario && usuario.nome) nomeUsuario.textContent = usuario.nome;
        }

        if (campoBio) campoBio.value = localStorage.getItem('perfilBio') || '';
        if (campoEmail && !campoEmail.value) campoEmail.value = localStorage.getItem('perfilEmail') || '';
        if (campoTelefone) campoTelefone.value = localStorage.getItem('perfilTelefone') || '';
        if (visualizarDados) visualizarDados.checked = localStorage.getItem('visualizarDados') === 'true';
        if (convitesAutomaticos) convitesAutomaticos.checked = localStorage.getItem('convitesAutomaticos') === 'true';

        const nomeSalvo = localStorage.getItem('perfilNome');
        if (nomeSalvo && nomeUsuario) nomeUsuario.textContent = nomeSalvo;

        botaoSalvar?.addEventListener('click', () => {
            if (campoBio) localStorage.setItem('perfilBio', campoBio.value);
            if (campoEmail) localStorage.setItem('perfilEmail', campoEmail.value);
            if (campoTelefone) localStorage.setItem('perfilTelefone', campoTelefone.value);
            if (visualizarDados) localStorage.setItem('visualizarDados', String(visualizarDados.checked));
            if (convitesAutomaticos) localStorage.setItem('convitesAutomaticos', String(convitesAutomaticos.checked));

            if (usuario) {
                usuario.nome = nomeUsuario?.textContent.trim() || usuario.nome;
                usuario.email = campoEmail?.value.trim().toLowerCase() || usuario.email;
                localStorage.setItem('smartcontrol_usuario', JSON.stringify(usuario));
            }

            window.alert('Alterações salvas com sucesso!');
        });

        botaoEditarNome?.addEventListener('click', () => {
            if (!nomeUsuario) return;
            const novoNome = (window.prompt('Digite o novo nome:', nomeUsuario.textContent.trim()) || '').trim();
            if (!novoNome) return;

            nomeUsuario.textContent = novoNome;
            localStorage.setItem('perfilNome', novoNome);

            try {
                const dados = JSON.parse(localStorage.getItem('smartcontrol_usuario') || 'null');
                if (dados) {
                    dados.nome = novoNome;
                    localStorage.setItem('smartcontrol_usuario', JSON.stringify(dados));
                }
            } catch (erro) {
                console.error('Erro ao atualizar o nome.', erro);
            }
        });

        botaoImagem?.addEventListener('click', () => {
            window.alert('A alteração da imagem pode ser conectada posteriormente ao sistema de upload.');
        });
    });
})();
