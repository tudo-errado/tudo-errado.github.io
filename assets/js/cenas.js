(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const adicionarCena = document.getElementById('adicionar-cena');
        const minhasCenas = document.getElementById('minhas-cenas');
        const menuCenas = document.getElementById('menu-cenas');
        const listaCenas = document.getElementById('lista-cenas');
        const CHAVE = 'cenasSmartControl';

        if (!adicionarCena && !minhasCenas) return;

        function obterCenas() {
            try {
                const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
                return Array.isArray(dados) ? dados.filter(Boolean).map(String) : [];
            } catch (erro) {
                return [];
            }
        }

        let cenasSalvas = obterCenas();

        function atualizarLista() {
            if (!listaCenas) return;
            listaCenas.innerHTML = '';

            cenasSalvas.forEach((cena) => {
                const item = document.createElement('div');
                item.className = 'item-cena';
                item.textContent = cena;
                listaCenas.appendChild(item);
            });
        }

        function fecharMenuAdicionar() {
            menuCenas?.classList.remove('aberto');
            const seta = adicionarCena?.querySelector('.seta-cena');
            if (seta) seta.style.transform = 'rotate(0deg)';
        }

        adicionarCena?.addEventListener('click', () => {
            if (!menuCenas) return;
            const aberto = menuCenas.classList.toggle('aberto');
            const seta = adicionarCena.querySelector('.seta-cena');
            if (seta) seta.style.transform = aberto ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        menuCenas?.querySelectorAll('button').forEach((botao) => {
            botao.addEventListener('click', (evento) => {
                evento.stopPropagation();
                const nome = (botao.dataset.cena || '').trim();
                if (!nome) return;

                if (!cenasSalvas.includes(nome)) {
                    cenasSalvas.push(nome);
                    localStorage.setItem(CHAVE, JSON.stringify(cenasSalvas));
                }

                atualizarLista();
                fecharMenuAdicionar();
            });
        });

        minhasCenas?.addEventListener('click', () => {
            if (!listaCenas) return;
            const aberta = listaCenas.classList.toggle('aberta');
            const seta = minhasCenas.querySelector('.seta-cena');
            if (seta) seta.style.transform = aberta ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        atualizarLista();
    });
})();
