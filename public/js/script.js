// Início controle do menu (mobile / desktop)
const open_close_btn = document.querySelector("#open-close-btn");
const header = document.querySelector("#header");

window.addEventListener("resize", resize);
open_close_btn.addEventListener("click", showHideMobileMenu);

function showHideMobileMenu() {
    if(header.style.display == "flex") { // Se o menu mobile estiver aparecendo
        header.style.display = "none"; 
        open_close_btn.innerText = "menu";
    } else {
        header.style.display = "flex";
        open_close_btn.innerText = "close";
    } 
}

function resize() { // Mostra/esconde o menu ao redimencionar a janela
    open_close_btn.innerText = "menu";
    if (innerWidth >= 800) {
        header.removeAttribute("style");
    } else {
        header.style.display = "none";
    }
}
// Fim controle do menu (mobile / desktop)

// Controle de exibição das flash messages
const message = document.querySelector("#message");

hideElementAfterSomeTime(message, 5000)

function hideElementAfterSomeTime(element, time) {
    if(!element) {
        return
    }
    setTimeout(() => {
        element.style.display = "none";
    }, time);
}

