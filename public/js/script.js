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

// Início esconde menu mobile ao clicar nos links
let menuNavigation = document.querySelector("#menuNavigation");
const menuNavigationLinks = Array.from(menuNavigation.children); // Converte para array

menuNavigationLinks.forEach(function(navLink) {
    navLink.addEventListener('click', () => {
        if (window.innerWidth < 800) {
            showHideMobileMenu();
        }
    })
});
// Fim esconde menu mobile ao clicar nos links

// Fim controle do menu (mobile / desktop)

// Início controle de exibição das flash messages
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
// Fim controle de exibição das flash messages

// // Início dashboard administrador
// const dashboardScreens = Array.from(document.querySelector('#adminDashboardScreen').children);
// const screenLinks = Array.from(document.querySelector('#linksList').children);

// screenLinks.forEach(link => {
//     link.addEventListener("click", (e) => {

//         dashboardScreens.forEach(screen => {
//             if (e.target.getAttribute("screenLink") == screen.getAttribute("screen")) {
//                 screen.style.display = "block"
//             } else {
//                 screen.style.display = "none"
//             }
//         })

//     })
// });
// // Fim dashboard administrador
