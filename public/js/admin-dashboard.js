// Início dashboard administrador
const dashboardScreens = Array.from(document.querySelector('#adminDashboardScreen').children);
const screenLinks = Array.from(document.querySelector('#linksList').children);

screenLinks.forEach(link => {
    link.addEventListener("click", (e) => {

        dashboardScreens.forEach(screen => {
            if (e.target.getAttribute("screenLink") == screen.getAttribute("screen")) {
                screen.style.display = "block"
            } else {
                screen.style.display = "none"
            }
        })

    })
});
// Fim dashboard administrador