import { displayActiveLink } from "./functions/displayActiveLink.js";
import { preventLoginIfAuthenticated } from "./functions/preventLoginIfAuthenticated.js";
import { updateNavbarAuthState } from "./functions/updateNavbarAuthState.js";
import { logout } from "./login/auth.js";

const logoutButton = document.getElementById("logout");

document.addEventListener("DOMContentLoaded", () => {
  displayActiveLink()
  updateNavbarAuthState()
  preventLoginIfAuthenticated()
  window.addEventListener('hashchange', () => displayActiveLink());

});

// --- Agregar productos a carrito --- //
function agregarProductoAlCarrito(nombre, imagen, precio, categoria) {
    const contenedor = document.querySelector('.card-body'); // o un contenedor específico para items

    const itemHTML = `
    <div class="row cart-item mb-3">
        <div class="col-md-3">
            <img src="${imagen}" alt="${nombre}" class="img-fluid rounded">
        </div>
        <div class="col-md-5">
            <h5 class="card-title">${nombre}</h5>
            <p class="text-muted">Category: ${categoria}</p>
        </div>
        <div class="col-md-2">
            <div class="input-group">
                <button class="btn btn-outline-secondary btn-sm" type="button">-</button>
                <input style="max-width:100px" type="text" class="form-control form-control-sm text-center quantity-input" value="1">
                <button class="btn btn-outline-secondary btn-sm" type="button">+</button>
            </div>
        </div>
        <div class="col-md-2 text-end">
            <p class="fw-bold">$${precio}</p>
            <button class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    </div>
    <hr>
    `;

    contenedor.insertAdjacentHTML('beforeend', itemHTML);
}

// --- Eliminar productos de carrito de compras --- //
document.querySelectorAll('.eliminar-item').forEach(btn => {
    btn.addEventListener('click', function() {
        // Código para eliminar el producto del DOM o actualizar el carrito
        const cartItem = btn.closest('.cart-item');
        if (cartItem) cartItem.remove();
    });
});