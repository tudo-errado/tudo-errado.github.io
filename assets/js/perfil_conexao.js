(() => {
    'use strict';

    const perfis = {
        'ZeroEsquerda': { papel: 'Admin', bio: 'A essência de algo é encontrada em sua ausência.', email: 'zeroesquerda@gmail.com.br', id: '#0106742', telefone: '+55 (16) 99867-4221', avatar: 'assets/images/logosmartcontrol.png' },
        'TudoErrado': { papel: 'Membro', bio: 'Você pode se arrepender de ser forte, mas não pode se arrepender de ser fraco.', email: 'tudoerrado@gmail.com', id: '#0198421', telefone: '+55 (16) 99999-1111' },
        'Th3usSy': { papel: 'Membro', bio: 'Às vezes, para fazer a coisa certa, é preciso se fazer de artista daquele que mais queremos.', email: 'th3ussy@gmail.com', id: '#0257319', telefone: '+55 (16) 98888-2222' },
        'moon': { papel: 'Membro', bio: 'amo cachaça 😎', email: 'moon@gmail.com', id: '#0349217', telefone: '+55 (16) 97777-3333' },
        'deus_supremo': { papel: 'Membro', bio: 'O único erro dentre todos x as perfeitas crianças de Deus, é a humanidade.', email: 'deus.supremo@gmail.com', id: '#0412865', telefone: '+55 (16) 96666-4444' }
    };

    function obterNome() {
        const parametros = new URLSearchParams(window.location.search);
        return parametros.get('usuario') || 'ZeroEsquerda';
    }

    function preencherPerfil() {
        const nome = obterNome();
        const dados = perfis[nome] || {
            papel: 'Membro', bio: 'Este usuário ainda não adicionou uma biografia.', email: 'Não informado', id: '#0000000', telefone: 'Não informado'
        };

        document.title = `${nome} - SmartControl`;
        document.getElementById('nome-conexao-perfil').textContent = nome;
        document.getElementById('papel-conexao-perfil').textContent = dados.papel;
        document.getElementById('bio-conexao-perfil').textContent = dados.bio;
        document.getElementById('email-conexao-perfil').textContent = dados.email;
        document.getElementById('id-conexao-perfil').textContent = dados.id;
        document.getElementById('telefone-conexao-perfil').textContent = dados.telefone;

        const banner = document.getElementById('banner-conexao');
        banner.style.backgroundImage = 'url("assets/images/background1.png")';

        if (dados.avatar) document.getElementById('avatar-conexao-grande').src = dados.avatar;
    }

    document.addEventListener('DOMContentLoaded', () => {
        preencherPerfil();

        const menu = document.getElementById('menu-conexao');
        document.getElementById('botao-menu-conexao')?.addEventListener('click', () => menu?.classList.toggle('aberto'));
        document.getElementById('botao-voltar-conexao')?.addEventListener('click', () => window.location.href = 'conexoes.html');
        document.getElementById('botao-voltar-lista')?.addEventListener('click', () => window.location.href = 'conexoes.html');
    });
})();
