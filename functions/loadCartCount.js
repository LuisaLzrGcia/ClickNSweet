const cartCountElement = document.getElementById("cart-indicator");

export function loadCartCount(){
    const cartCount = JSON.parse(localStorage.getItem("cartCount")) || 0;
    if (cartCount > 9) {
        cartCountElement.classList.add("cart-badge-big-count");
        cartCountElement.innerText = "9+"
    } else {
        cartCountElement.innerText = Math.max(cartCount, 0);
        cartCountElement.classList.remove("cart-badge-big-count");
    }
}

