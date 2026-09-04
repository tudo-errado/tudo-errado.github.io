(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const popups = document.querySelectorAll('.popup-fundo');
        const botoesAbrir = document.querySelectorAll('.botao-saiba-mais');
        const botoesFechar = document.querySelectorAll('.botao-fechar');

        function fecharTodos() {
            popups.forEach((popup) => popup.classList.remove('aberto'));
            document.body.style.overflow = '';
        }

        botoesAbrir.forEach((botao) => {
            botao.addEventListener('click', (evento) => {
                evento.preventDefault();
                evento.stopPropagation();

                const id = botao.dataset.popup;
                const popup = id ? document.getElementById(id) : null;
                if (!popup) return;

                fecharTodos();
                popup.classList.add('aberto');
                document.body.style.overflow = 'hidden';
            });
        });

        botoesFechar.forEach((botao) => {
            botao.addEventListener('click', (evento) => {
                evento.preventDefault();
                fecharTodos();
            });
        });

        popups.forEach((popup) => {
            popup.addEventListener('click', (evento) => {
                if (evento.target === popup) fecharTodos();
            });
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape') fecharTodos();
        });
    });
})();
