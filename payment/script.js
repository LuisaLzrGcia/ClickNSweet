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
        const response = await fetch(`http://98.82.183.146/api/v1/clicknsweet/address/user/${userId}`, {
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
        const response = await fetch("http://98.82.183.146/api/v1/clicknsweet/orders", {
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

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        loadUserAddresses(usuario.id);
    }
});


async function getTarjetas() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let idUser = JSON.parse(localStorage.getItem("usuario")).id

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("http://98.82.183.146/api/v1/clicknsweet/users/" + idUser + "/cards", requestOptions);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const tarjetas = await response.json();
        renderTarjetas(tarjetas);
    } catch (error) {
        console.error("Error obteniendo tarjetas:", error);
    }
}

function renderTarjetas(lista) {
    const container = document.getElementById("tarjetas-container");

    lista.forEach((tarjeta, index) => {
        const lastDigits = tarjeta.numberCard.slice(-4);
        const label = document.createElement("label");
        label.className = "form-check-label d-flex justify-content-between w-100";
        label.setAttribute("for", `tarjeta${index + 1}`);
        label.innerHTML = `
                <span>Tarjeta que termina en ${lastDigits}</span>
                <span>${tarjeta.user.firstName}</span>
                <span>${tarjeta.expirationDate}</span>
            `;

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "radio";
        input.name = "tarjeta";
        input.id = `tarjeta${index + 1}`;
        if (index === 0) input.checked = true;

        const div = document.createElement("div");
        div.className = "form-check mb-3";
        div.appendChild(input);
        div.appendChild(label);

        container.appendChild(div);
    });

    // Botón para elegir otro método
    const btn = document.createElement("button");
    btn.className = "btn btn-alt";
    btn.textContent = "Elegir otro método de pago";
    btn.addEventListener("click", () => {
        window.location.href = "../account-details/index.html";
    });

    container.appendChild(btn);
}

// Ejecutar al cargar
getTarjetas();