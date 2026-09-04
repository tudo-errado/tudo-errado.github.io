(() => {
    'use strict';

    const CHAVE = 'smartcontrol_conexoes';

    const perfis = {
        'ZeroEsquerda': {
            papel: 'Admin',
            bio: 'A essência de algo é encontrada em sua ausência.',
            email: 'zeroesquerda@gmail.com.br',
            id: '#0106742',
            telefone: '+55 (16) 99867-4221',
            banner: 'assets/images/background1.png',
            avatar: 'assets/images/logosmartcontrol.png'
        },
        'TudoErrado': {
            papel: 'Membro',
            bio: 'Você pode se arrepender de ser forte, mas não pode se arrepender de ser fraco.',
            email: 'tudoerrado@gmail.com',
            id: '#0198421',
            telefone: '+55 (16) 99999-1111',
            banner: 'assets/images/background1.png'
        },
        'Th3usSy': {
            papel: 'Membro',
            bio: 'Às vezes, para fazer a coisa certa, é preciso se fazer de artista daquele que mais queremos. Até dois nossos sonhos.',
            email: 'th3ussy@gmail.com',
            id: '#0257319',
            telefone: '+55 (16) 98888-2222',
            banner: 'assets/images/background1.png'
        },
        'moon': {
            papel: 'Membro',
            bio: 'amo cachaça 😎',
            email: 'moon@gmail.com',
            id: '#0349217',
            telefone: '+55 (16) 97777-3333',
            banner: 'assets/images/background1.png'
        },
        'deus_supremo': {
            papel: 'Membro',
            bio: 'O único erro dentre todos x as perfeitas crianças de Deus, é a humanidade.',
            email: 'deus.supremo@gmail.com',
            id: '#0412865',
            telefone: '+55 (16) 96666-4444',
            banner: 'assets/images/background1.png'
        }
    };

    function obterConexoes() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.warn('Não foi possível ler as conexões.', erro);
            return [];
        }
    }

    function criarItem(nome, papel = 'Membro') {
        const item = document.createElement('div');
        item.className = 'item-conexao';
        item.dataset.nome = nome;
        item.dataset.papel = papel;
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.innerHTML = `
            <div class="avatar-conexao">◉</div>
            <div class="informacoes-conexao">
                <span class="nome-conexao"></span>
                <small></small>
            </div>`;
        item.querySelector('.nome-conexao').textContent = nome;
        item.querySelector('small').textContent = papel;
        return item;
    }

    function adicionarDadosNosItensExistentes() {
        document.querySelectorAll('.item-conexao').forEach((item) => {
            const nome = item.querySelector('.nome-conexao')?.textContent.trim();
            const papel = item.querySelector('.informacoes-conexao small')?.textContent.trim() || perfis[nome]?.papel || 'Membro';
            if (nome) {
                item.dataset.nome = nome;
                item.dataset.papel = papel;
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
            }
        });
    }

    function obterPerfil(nome, papel) {
        const base = perfis[nome] || {};
        return {
            nome,
            papel: base.papel || papel || 'Membro',
            bio: base.bio || 'Este usuário ainda não adicionou uma biografia.',
            email: base.email || 'Não informado',
            id: base.id || '#0000000',
            telefone: base.telefone || 'Não informado',
            banner: base.banner || 'assets/images/background1.png',
            avatar: base.avatar || 'assets/images/logosmartcontrol.png'
        };
    }

    function fecharModal() {
        const modal = document.getElementById('modal-conexao');
        if (!modal) return;
        modal.classList.remove('aberto');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-aberto');
    }

    function abrirModal(nome, papel) {
        const modal = document.getElementById('modal-conexao');
        if (!modal) return;

        const perfil = obterPerfil(nome, papel);
        modal.querySelector('.modal-nome').textContent = perfil.nome;
        modal.querySelector('.modal-papel').textContent = perfil.papel;
        modal.querySelector('.modal-bio').textContent = perfil.bio;
        modal.querySelector('.modal-email').textContent = perfil.email;
        modal.querySelector('.modal-id').textContent = perfil.id;
        modal.querySelector('.modal-telefone').textContent = perfil.telefone;
        modal.querySelector('.modal-banner').style.backgroundImage = `url("${perfil.banner}")`;
        modal.querySelector('.modal-avatar').src = perfil.avatar;
        modal.querySelector('.botao-visualizar-perfil').dataset.nome = perfil.nome;

        modal.classList.add('aberto');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-aberto');
    }

    function criarModal() {
        if (document.getElementById('modal-conexao')) return;

        const modal = document.createElement('div');
        modal.id = 'modal-conexao';
        modal.className = 'modal-conexao';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-conexao-overlay" data-fechar-modal></div>
            <section class="janela-conexao" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-conexao">
                <div class="modal-banner">
                    <button class="botao-fechar-modal" type="button" aria-label="Fechar" data-fechar-modal>×</button>
                    <div class="modal-avatar-wrapper">
                        <img class="modal-avatar" src="assets/images/logosmartcontrol.png" alt="">
                    </div>
                </div>

                <div class="modal-corpo">
                    <h2 id="titulo-modal-conexao">Gerenciar Conexão</h2>
                    <div class="modal-identidade">
                        <strong class="modal-nome"></strong>
                        <span class="modal-papel"></span>
                    </div>

                    <div class="modal-dados">
                        <div><span>Apelido</span><strong class="modal-nome"></strong></div>
                        <div><span>Papel</span><strong class="modal-papel"></strong></div>
                    </div>

                    <p class="modal-bio"></p>
                    <p><b>E-mail:</b> <span class="modal-email"></span></p>
                    <p><b>ID:</b> <span class="modal-id"></span></p>
                    <p><b>Telefone:</b> <span class="modal-telefone"></span></p>

                    <div class="modal-acoes">
                        <button class="botao-visualizar-perfil" type="button">Visualizar Perfil</button>
                        <button class="botao-salvar-conexao" type="button">Salvar Alterações</button>
                    </div>
                </div>
            </section>`;
        document.body.appendChild(modal);

        modal.addEventListener('click', (evento) => {
            if (evento.target.closest('[data-fechar-modal]')) fecharModal();
        });

        modal.querySelector('.botao-visualizar-perfil').addEventListener('click', (evento) => {
            const nome = evento.currentTarget.dataset.nome || '';
            if (!nome) return;
            window.location.href = `perfil_conexao.html?usuario=${encodeURIComponent(nome)}`;
        });

        modal.querySelector('.botao-salvar-conexao').addEventListener('click', () => {
            window.alert('Alterações da conexão salvas.');
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape') fecharModal();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const botao = document.getElementById('adicionar-conta');
        const lista = document.querySelector('.lista-conexoes');
        if (!lista) return;

        adicionarDadosNosItensExistentes();
        criarModal();

        obterConexoes().forEach((conexao) => {
            if (!conexao?.nome) return;
            lista.appendChild(criarItem(String(conexao.nome), conexao.papel || 'Membro'));
        });

        lista.addEventListener('click', (evento) => {
            const item = evento.target.closest('.item-conexao');
            if (!item) return;
            abrirModal(item.dataset.nome, item.dataset.papel);
        });

        lista.addEventListener('keydown', (evento) => {
            if (evento.key !== 'Enter' && evento.key !== ' ') return;
            const item = evento.target.closest('.item-conexao');
            if (!item) return;
            evento.preventDefault();
            abrirModal(item.dataset.nome, item.dataset.papel);
        });

        botao?.addEventListener('click', () => {
            const nome = (window.prompt('Digite o nome da conta:') || '').trim();
            if (!nome) return;

            const conexoes = obterConexoes();
            const existeNaTela = [...lista.querySelectorAll('.item-conexao')]
                .some((item) => item.dataset.nome?.toLowerCase() === nome.toLowerCase());

            if (existeNaTela || conexoes.some((item) => item?.nome?.toLowerCase() === nome.toLowerCase())) {
                window.alert('Essa conta já foi adicionada.');
                return;
            }

            conexoes.push({ nome, papel: 'Membro' });
            localStorage.setItem(CHAVE, JSON.stringify(conexoes));
            lista.appendChild(criarItem(nome, 'Membro'));
        });
    });
})();

