const menu = document.querySelector(".btnMenu");
const cerrarMenu = document.querySelector(".cerrar");
const modalMenu = document.querySelector(".modal");
const spinner = document.querySelector('.spinner');

menu.addEventListener("click", abrirModal);
cerrarMenu.addEventListener("click", cerrarModal)

function abrirModal(){
    modalMenu.classList.add("show");
    spinner.classList.add("after");
}

function cerrarModal(){
    modalMenu.classList.remove("show");
}
