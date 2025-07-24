import { countries } from "../data/countries.js";
import { statesMexico } from "../data/statesMexico.js";
import { renderStars } from "../functions/renderStars.js";

document.addEventListener("DOMContentLoaded", function () {
    createListCountries();
})

function createListCountries() {
    const countriesData = countries,
        select = document.getElementById("country-new-product");
    select.innerHTML = `<option selected value="">Selecciona un país</option>`;
    countriesData.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
    });

}

window.isMexico = (e) => {
    const selectedIndex = e.selectedIndex - 1;

    const container = document.getElementById("state-mexico-new-product");
    const selectEstados = document.getElementById("state-new-product");

    if (selectedIndex > -1 && countries[selectedIndex] === "México") {
        selectEstados.disabled = false; // habilita el select

        selectEstados.innerHTML = `<option selected value="">Selecciona un estado</option>`;
        statesMexico.forEach(estado => {
            const option = document.createElement("option");
            option.value = estado;
            option.textContent = estado;
            selectEstados.appendChild(option);
        });
    } else {
        selectEstados.disabled = true; // deshabilita el select
        selectEstados.innerHTML = `<option selected value="">Selecciona un estado</option>`;
    }
};


window.generatePreview = () => {

    validateFormFields({ showAlert: false });

    const data = getFormData();

    const tieneImagen = data.imagenes && data.imagenes.length > 0;
    const imagenHTML = tieneImagen
        ? `<img src="./assets/${data.imagenes[0]}" alt="Imagen del producto"
      class="img-fluid rounded-3 w-100 shadow-sm" style="object-fit: cover;">`
        : `<div class="bg-light d-flex align-items-center justify-content-center rounded-3 shadow-sm w-100" style="height: 300px;">
        <span class="text-muted">Sin imagen</span>
     </div>`;

    const descuento = parseFloat(data.descuento) || 0;
    const precio = parseFloat(data.precio) || 0;
    const precioOferta = parseFloat(data.precioOferta) || 0;

    const formatoMoneda = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2
    });

    let priceData = "";
    if (descuento > 0) {
        priceData = `
    <p class="text-fuchsia">
      <span class="discount">${descuento}% OFF</span> 
      <strong class="offerBadge">Promoción</strong>
    </p>
    <span class="new-price">${formatoMoneda.format(precioOferta)}</span> 
    <span class="old-price">${formatoMoneda.format(precio)}</span>`;
    } else {
        priceData = `<span class="normal-price">${formatoMoneda.format(precio)}</span>`;
    }


    const html = `
    <h2>Vista previa del detalles del producto</h2>
    <div class="row g-4 align-items-start p-4">
      <!-- Imagen del producto -->
      <div class="col-md-6">
        ${imagenHTML}
      </div>

      <!-- Detalles del producto -->
      <div class="col-md-6">
        <h2 class="mb-3 text-fuchsia">${data.nombre || "Nombre del producto"}</h2>

        <!-- Calificación (fija por ahora) -->
        <div class="star-rating mb-2 text-warning fs-5">
          ${renderStars(5)}
        </div>

        <!-- Precios y descuento -->
        <div class="mb-3">
          ${priceData}
        </div>

        <div class="row mb-3">
          <!-- Presentación -->
          <div class="col-12 col-md-6 mb-3 mb-md-0">
            <p class="fw-semibold text-muted mb-1">Presentación:</p>
            <p class="text-dark mb-0 formatSaleBadge">${data.formatoVenta || "N/A"}</p>
          </div>

          <!-- Cantidad -->
          <div class="col-12 col-md-6">
            <label for="cantidad" class="form-label fw-semibold text-muted">Cantidad:</label>
            <select id="cantidad" class="form-select w-100">
              ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
          </div>
        </div>

        <!-- Descripción -->
        <p class="text-muted">
          ${data.descripcion || "Sin descripción del producto."}
        </p>

        <!-- Información adicional -->
        <div class="mt-4 text-muted small d-flex flex-column gap-1 category">
          <p class="mb-1">
            <strong>Categoría:</strong>
            <span class="badge pastel-creamy text-dark fs-6">${data.categoria || "No definida"}</span>
          </p>

          <p class="mb-1">
            <strong>Origen:</strong>
            <span class="badge bg-pastel-green text-dark">
              ${data.pais || "Desconocido"}${data.pais === "México" && data.estado ? ` - ${data.estado}` : ""}
            </span>
          </p>

          <p class="mb-0">
            <strong>Disponibilidad:</strong>
            <span class="badge bg-mint-light text-dark">
              ${parseInt(data.stock) > 0 ? "En stock" : "Agotado"}
            </span>
          </p>
        </div>

        <!-- Botón de añadir al carrito -->
        <div class="d-grid gap-2 mt-4">
          <button class="btn btn-pink text-white py-2 px-4" type="button">
            <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
          </button>
        </div>
      </div>
    </div>`;

    // Insertar en contenedor
    document.getElementById("preview-new-product").innerHTML = html;

    const preview = document.getElementById("preview-new-product");

    if (preview) {
        preview.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};


window.saveProduct = () => {
    const esValido = validateFormFields({ showAlert: true });

    if (!esValido) return;

    const producto = getFormData();


    // Si todo es válido, guardar en localStorage
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));

    Swal.fire({
        icon: 'success',
        title: 'Producto guardado',
        text: 'El producto ha sido agregado correctamente.',
        timer: 2000,
        showConfirmButton: false
    });

    // document.getElementById("form-nuevo-producto").reset();

    // // Limpiar clases de validación
    // camposRequeridos.forEach(campo => {
    //     const input = document.getElementById(campo.id);
    //     input.classList.remove("is-valid", "is-invalid");
    // });
}

function getFormData() {
    const dimensionesInputs = document.querySelectorAll("#dimensions-new-product input");

    return {
        nombre: document.getElementById("name-new-product").value.trim(),
        descripcion: document.getElementById("description-new-product").value.trim(),
        precio: document.getElementById("price-new-product").value,
        descuento: document.getElementById("discount-new-product").value,
        precioOferta: document.getElementById("price-discount-new-product").value,
        formatoVenta: document.getElementById("price-format-new-product").value,
        categoria: document.getElementById("category-new-product").value,
        pais: document.getElementById("country-new-product").value,
        estado: document.getElementById("state-new-product").value,
        sku: document.getElementById("sku-new-product").value,
        stock: document.getElementById("stock-new-product").value,
        permitirReservas: document.getElementById("allow-reserve") ? document.getElementById("allow-reserve").value : null,
        umbral: document.getElementById("stock-threshold") ? document.getElementById("stock-threshold").value : null,
        peso: document.getElementById("weight-new-product") ? document.getElementById("weight-new-product").value : null,
        dimensiones: dimensionesInputs.length > 0 ? Array.from(dimensionesInputs).map(input => input.value) : [],
        imagenes: (() => {
            const inputImagenes = document.getElementById("image-new-product");
            if (inputImagenes && inputImagenes.files.length > 0) {
                // Extraer nombres de archivos o puedes manejar URLs base64 si quieres
                return Array.from(inputImagenes.files).map(file => file.name);
            }
            return [];
        })()
    };
}


const precioNormalInput = document.getElementById("price-new-product");
const descuentoInput = document.getElementById("discount-new-product");
const precioOfertaInput = document.getElementById("price-discount-new-product");

precioNormalInput.addEventListener("input", () => {
    if (precioNormalInput.value.trim() !== "") {
        priceChange(); // Verifica si hay descuento o precio de oferta y actualiza el otro
    }
});

descuentoInput.addEventListener("input", () => {
    if (descuentoInput.value.trim() !== "") {
        // Si hay descuento, calcula precio oferta y deshabilita precio oferta
        princingDiscountChange();
        precioOfertaInput.disabled = true;
    } else {
        // Si descuento está vacío, habilita precio oferta y limpia su valor
        precioOfertaInput.disabled = false;
        precioOfertaInput.value = "";
    }
});

precioOfertaInput.addEventListener("input", () => {
    if (precioOfertaInput.value.trim() !== "") {
        // Si hay precio oferta, calcula descuento y deshabilita descuento
        discountChange();
        descuentoInput.disabled = true;
    } else {
        // Si precio oferta está vacío, habilita descuento y limpia su valor
        descuentoInput.disabled = false;
        descuentoInput.value = "";
    }
});

const priceChange = () => {
    const price = parseFloat(precioNormalInput.value);
    const discount = parseFloat(descuentoInput.value);
    const offerPrice = parseFloat(precioOfertaInput.value);

    const discountFilled = descuentoInput.value.trim() !== "" && !isNaN(discount);
    const offerPriceFilled = precioOfertaInput.value.trim() !== "" && !isNaN(offerPrice);

    if (!isNaN(price)) {
        if (discountFilled) {
            const newOfferPrice = price - (price * (discount / 100));
            precioOfertaInput.value = newOfferPrice.toFixed(2);
        } else if (offerPriceFilled) {
            const newDiscount = ((price - offerPrice) / price) * 100;
            descuentoInput.value = newDiscount.toFixed(2);
        }
    }
};

function princingDiscountChange() {
    const precioNormal = parseFloat(precioNormalInput.value);
    const descuento = parseFloat(descuentoInput.value);

    if (!isNaN(precioNormal) && !isNaN(descuento)) {
        const precioOferta = precioNormal - (precioNormal * (descuento / 100));
        precioOfertaInput.value = precioOferta.toFixed(2);
    } else {
        precioOfertaInput.value = "";
    }
}

function discountChange() {
    const precioNormal = parseFloat(precioNormalInput.value);
    const precioOferta = parseFloat(precioOfertaInput.value);

    if (!isNaN(precioNormal) && !isNaN(precioOferta) && precioNormal > 0) {
        const descuento = ((precioNormal - precioOferta) / precioNormal) * 100;
        descuentoInput.value = descuento.toFixed(2);
    } else {
        descuentoInput.value = "";
    }
}


function validateFormFields({ showAlert = false } = {}) {
    const producto = getFormData();

    const camposRequeridos = [
        { id: "name-new-product", nombre: "Nombre" },
        { id: "description-new-product", nombre: "Descripción" },
        { id: "price-new-product", nombre: "Precio" },
        { id: "price-format-new-product", nombre: "Formato de venta" },
        { id: "category-new-product", nombre: "Categoría" },
        { id: "country-new-product", nombre: "País" },
        { id: "sku-new-product", nombre: "SKU" },
        { id: "stock-new-product", nombre: "Stock" }
    ];

    if (producto.pais === "México") {
        camposRequeridos.push({ id: "state-new-product", nombre: "Estado" });
    }

    let valido = true;
    let primerCampoInvalido = null;

    camposRequeridos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const valor = input.value.trim();

        if (!valor ||
            (campo.id === "price-new-product" && Number(valor) <= 0) ||
            (campo.id === "stock-new-product" && Number(valor) < 1)) {

            input.classList.add("is-invalid");
            if (!primerCampoInvalido) primerCampoInvalido = input;
            valido = false;
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        }
    });

    if (!valido && showAlert) {
        primerCampoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primerCampoInvalido.focus();

        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor completa todos los campos obligatorios.',
            confirmButtonText: 'Revisar',
            customClass: {
                confirmButton: 'bg-fuchsia text-white border-0 px-4 py-2 rounded',
                icon: 'bg-fuchsia text-white p-3 rounded-circle border-0',
                title: 'text-fuchsia',
            }
        });

        return false;
    }

    return valido;
}
