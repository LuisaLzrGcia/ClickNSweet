export function loadCartCount() {
  const cartCountElement = document.getElementById("cart-indicator");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;
  if (cartCount > 9) {
    cartCountElement.classList.add("cart-badge-big-count");
    cartCountElement.innerText = "+9";
  } else {
    cartCountElement.innerText = Math.max(cartCount, 0);
    cartCountElement.classList.remove("cart-badge-big-count");
  }
}
