(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const campoBusca = document.getElementById('card-search');
        const limparBusca = document.getElementById('clear-search');
        const semResultados = document.getElementById('no-results');
        const cartoesBuscaveis = document.querySelectorAll('.searchable-card');

        function filtrarCartoes() {
            const termo = (campoBusca?.value || '').trim().toLowerCase();
            let algumVisivel = false;

            cartoesBuscaveis.forEach((cartao) => {
                const conteudo = (cartao.dataset.search || cartao.textContent || '').toLowerCase();
                const visivel = !termo || conteudo.includes(termo);
                cartao.style.display = visivel ? '' : 'none';
                if (visivel) algumVisivel = true;
            });

            if (semResultados) semResultados.hidden = algumVisivel || !termo;
        }

        campoBusca?.addEventListener('input', filtrarCartoes);
        limparBusca?.addEventListener('click', () => {
            if (!campoBusca) return;
            campoBusca.value = '';
            filtrarCartoes();
            campoBusca.focus();
        });

        const CHAVE_AMBIENTES = 'smartcontrol_ambientes';
        const cartoesAmbientes = document.querySelectorAll('.room-card');
        let estados = {};

        try {
            estados = JSON.parse(localStorage.getItem(CHAVE_AMBIENTES) || '{}') || {};
        } catch (erro) {
            estados = {};
        }

        cartoesAmbientes.forEach((card, indice) => {
            const interruptor = card.querySelector('.switch');
            const nome = card.querySelector('b')?.textContent.trim() || `ambiente-${indice}`;
            const possuiEstado = Object.prototype.hasOwnProperty.call(estados, nome);
            const ligado = possuiEstado ? Boolean(estados[nome]) : card.classList.contains('active') || interruptor?.classList.contains('on');

            function atualizar(estado) {
                card.classList.toggle('active', estado);
                interruptor?.classList.toggle('on', estado);
                estados[nome] = estado;
                localStorage.setItem(CHAVE_AMBIENTES, JSON.stringify(estados));
            }

            atualizar(ligado);
            card.addEventListener('click', () => atualizar(!card.classList.contains('active')));
        });
    });
})();
