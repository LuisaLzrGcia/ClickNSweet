// Función para generar un trackingNumber alfanumérico
function generarTrackingNumber(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function checkUserAndRedirect() {
    // Solo ejecutar si estamos en payment/index.html
    if (window.location.pathname.endsWith('payment/index.html')) {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Redirigir si no hay usuario o el carrito está vacío
        if (!usuario || Object.keys(usuario).length === 0 || cart.length === 0) {
            alert("Inicia sesión!")
            window.location.href = '../login/index.html';
        }
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", checkUserAndRedirect);


// Cargar direcciones del usuario
async function loadUserAddresses(userId) {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/clicknsweet/address/user/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const addresses = await response.json();
        const select = document.getElementById('address-select');
        const selectedDiv = document.getElementById('selected-address');

        // Limpiar select
        select.innerHTML = '';

        addresses.forEach(addr => {
            const option = document.createElement('option');
            option.value = addr.id;
            option.textContent = addr.address;
            select.appendChild(option);
        });

        if (addresses.length > 0) {
            select.value = addresses[0].id;
            selectedDiv.textContent = addresses[0].address;
        }

        select.addEventListener('change', () => {
            const selected = addresses.find(a => a.id == select.value);
            selectedDiv.textContent = selected ? selected.address : '';
        });

    } catch (error) {
        console.error("Error cargando direcciones:", error);
    }
}

// Función para crear orden
export default async function createOrder(orderData) {
    try {
        const response = await fetch("http://localhost:8080/api/v1/clicknsweet/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error al crear la orden:", error);
        throw error;
    }
}

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => {
            alert("Aquí puedes abrir un modal o redirigir a un formulario para añadir dirección.");
        });
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        loadUserAddresses(usuario.id);
    }
});
