document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/index.html')) {
        renderCarrito();
    }
});

function agregarProductoAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);

    if (window.location.pathname.includes('cart.html')) {
        renderCarrito();
    }
}

function renderCarrito() {
    const cartItemsContainer = document.getElementById('cart-items');
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];

    cartItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        actualizarResumen([]);
        return;
    }

    carrito.forEach((producto, index) => {
        cartItemsContainer.innerHTML += `
            <div class="card mb-2">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <img src="${producto.imagen}" width="50" class="me-3">
                    <strong>${producto.nombre}</strong>
                    <span>$${producto.precio} x ${producto.cantidad}</span>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button>
                </div>
            </div>
        `;
    });

    actualizarResumen(carrito);
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

function actualizarResumen(carrito) {
    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const envio = carrito.length > 0 ? 10.00 : 0.00;
    const iva = subtotal * 0.10;
    const total = subtotal + envio + iva;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('envio').textContent = `$${envio.toFixed(2)}`;
    document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}
