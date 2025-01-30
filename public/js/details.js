// Início carrinho
const addToCartBtn = document.querySelector("#addToCart");

addToCartBtn.addEventListener("click", () => {
    const paintingDetails = addToCart.getAttribute("data");

    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify({ details: [paintingDetails] }));
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart"));

    cart.details.push(paintingDetails);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Movido para o carrinho!")
})
// Fim carrinho




// Início muda imagem destaque

// let imgCardsContainer = document.querySelector("#imgCardsContainer");
// let imgDestaque = document.querySelector("#imgDestaque");

// const imgCardsArray = Array.from(imgCardsContainer.children); // Converte para array

// imgCardsArray.forEach(function(imgCard) {
//     imgCard.addEventListener('click', (e) => {
//         imgDestaque.setAttribute("src", e.target.getAttribute("src"));
//     })
// });

// Fim muda imagem destaque
