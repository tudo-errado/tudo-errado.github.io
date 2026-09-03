const botaoMenu =
    document.getElementById("botao-menu");

const menuLateral =
    document.getElementById("menu-lateral");


if (botaoMenu && menuLateral) {

    botaoMenu.addEventListener(
        "click",
        function () {

            menuLateral.classList.toggle(
                "aberto"
            );

        }
    );

}

const botaoVoltar =
    document.getElementById("botao-voltar");


if (botaoVoltar) {

    botaoVoltar.addEventListener(
        "click",
        function () {

            if (window.history.length > 1) {

                window.history.back();

            } else {

                window.location.href =
                    "dashboard.html";

            }

        }
    );

}

    document.getElementById("campo-bio");

const campoEmail =
    document.getElementById("campo-email");

const campoTelefone =
    document.getElementById("campo-telefone");

const visualizarDados =
    document.getElementById("visualizar-dados");

const convitesAutomaticos =
    document.getElementById("convites-automaticos");


const bioSalva =
    localStorage.getItem("perfilBio");

const emailSalvo =
    localStorage.getItem("perfilEmail");

const telefoneSalvo =
    localStorage.getItem("perfilTelefone");

const visualizarSalvo =
    localStorage.getItem("visualizarDados");

const convitesSalvos =
    localStorage.getItem("convitesAutomaticos");


if (bioSalva && campoBio) {

    campoBio.value = bioSalva;

}

if (emailSalvo && campoEmail) {

    campoEmail.value = emailSalvo;

}

if (telefoneSalvo && campoTelefone) {

    campoTelefone.value = telefoneSalvo;

}

if (visualizarDados) {

    visualizarDados.checked =
        visualizarSalvo === "true";

}

if (convitesAutomaticos) {

    convitesAutomaticos.checked =
        convitesSalvos === "true";

}

const botaoSalvar =
    document.getElementById("botao-salvar");


if (botaoSalvar) {

    botaoSalvar.addEventListener(
        "click",
        function () {


            if (campoBio) {

                localStorage.setItem(
                    "perfilBio",
                    campoBio.value
                );

            }


            if (campoEmail) {

                localStorage.setItem(
                    "perfilEmail",
                    campoEmail.value
                );

            }


            if (campoTelefone) {

                localStorage.setItem(
                    "perfilTelefone",
                    campoTelefone.value
                );

            }


            if (visualizarDados) {

                localStorage.setItem(
                    "visualizarDados",
                    visualizarDados.checked
                );

            }


            if (convitesAutomaticos) {

                localStorage.setItem(
                    "convitesAutomaticos",
                    convitesAutomaticos.checked
                );

            }


            alert(
                "Alterações salvas com sucesso!"
            );

        }
    );

}

const botaoEditarNome =
    document.getElementById("botao-editar-nome");

const nomeUsuario =
    document.getElementById("nome-usuario");


if (botaoEditarNome && nomeUsuario) {

    botaoEditarNome.addEventListener(
        "click",
        function () {

            const novoNome =
                prompt(
                    "Digite o novo nome:",
                    nomeUsuario.textContent.trim()
                );


            if (
                novoNome &&
                novoNome.trim() !== ""
            ) {

                nomeUsuario.textContent =
                    novoNome.trim();

                localStorage.setItem(
                    "perfilNome",
                    novoNome.trim()
                );

            }

        }
    );

}

const nomeSalvo =
    localStorage.getItem("perfilNome");


if (
    nomeSalvo &&
    nomeUsuario
) {

    nomeUsuario.textContent =
        nomeSalvo;

}

const botaoImagem =
    document.getElementById("botao-imagem");


if (botaoImagem) {

    botaoImagem.addEventListener(
        "click",
        function () {

            alert(
                "A alteração da imagem pode ser conectada posteriormente ao sistema de upload."
            );

        }
    );

}