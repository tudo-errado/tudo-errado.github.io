(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const lista = document.getElementById('lista-dispositivos');
        const botaoAdicionar = document.getElementById('adicionar-dispositivo');
        const modalCameras = document.getElementById('modal-cameras');
        const modalNovo = document.getElementById('modal-novo-dispositivo');
        const formNovo = document.getElementById('form-novo-dispositivo');
        const nomeNovo = document.getElementById('nome-novo-dispositivo');
        const tipoNovo = document.getElementById('tipo-novo-dispositivo');
        const CHAVE = 'smartcontrol_dispositivos';

        if (!lista) return;

        function obterDispositivos() {
            try {
                const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
                return Array.isArray(dados) ? dados.filter(Boolean) : [];
            } catch (erro) {
                return [];
            }
        }

        function salvarDispositivos(dispositivos) {
            localStorage.setItem(CHAVE, JSON.stringify(dispositivos));
        }

        function abrirModal(modal) {
            if (!modal) return;
            modal.classList.add('aberto');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-aberto');
        }

        function fecharModal(modal) {
            if (!modal) return;
            modal.classList.remove('aberto');
            modal.setAttribute('aria-hidden', 'true');
            if (!document.querySelector('.modal-dispositivos.aberto')) {
                document.body.classList.remove('modal-aberto');
            }
        }

        function criarItem(dispositivo) {
            const nome = typeof dispositivo === 'string' ? dispositivo : dispositivo.nome;
            const tipo = typeof dispositivo === 'string' ? 'dispositivo' : dispositivo.tipo;
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'item-dispositivo';
            item.dataset.tipo = tipo || 'dispositivo';
            item.innerHTML = '<span class="icone-dispositivo" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg></span><span class="nome-dispositivo"></span>';
            item.querySelector('.nome-dispositivo').textContent = nome;
            return item;
        }

        function adicionarItemSalvo(dispositivo) {
            lista.appendChild(criarItem(dispositivo));
        }

        obterDispositivos().forEach(adicionarItemSalvo);

        // Clicar em qualquer câmera abre as três câmeras.
        lista.addEventListener('click', (evento) => {
            const item = evento.target.closest('.item-dispositivo');
            if (!item) return;
            const nome = item.querySelector('.nome-dispositivo')?.textContent?.trim() || '';
            const ehCamera = item.classList.contains('item-camera') || /câmera|camera/i.test(nome) || item.dataset.tipo === 'camera';
            if (ehCamera) abrirModal(modalCameras);
        });

        botaoAdicionar?.addEventListener('click', () => {
            abrirModal(modalNovo);
            setTimeout(() => nomeNovo?.focus(), 80);
        });

        formNovo?.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = nomeNovo.value.trim();
            const tipo = tipoNovo.value;
            if (!nome || !tipo) return;

            const dispositivos = obterDispositivos();
            if (dispositivos.some(d => (typeof d === 'string' ? d : d.nome).toLowerCase() === nome.toLowerCase())) {
                window.alert('Esse dispositivo já foi adicionado.');
                return;
            }

            dispositivos.push({ nome, tipo });
            salvarDispositivos(dispositivos);
            adicionarItemSalvo({ nome, tipo });
            formNovo.reset();
            fecharModal(modalNovo);
        });

        document.querySelectorAll('[data-fechar-modal]').forEach((botao) => {
            botao.addEventListener('click', () => {
                fecharModal(document.getElementById(botao.dataset.fecharModal));
            });
        });

        document.querySelectorAll('.modal-dispositivos').forEach((modal) => {
            modal.addEventListener('click', (evento) => {
                if (evento.target === modal) fecharModal(modal);
            });
        });

        document.addEventListener('keydown', (evento) => {
            if (evento.key !== 'Escape') return;
            document.querySelectorAll('.modal-dispositivos.aberto').forEach(fecharModal);
        });
    });
})();
