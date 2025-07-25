import { countries } from "../data/countries.js";
import { statesMexico } from "../data/statesMexico.js";
import { renderStars } from "../functions/renderStars.js";
import { productDetailView } from "../product-detail/productDetailView.js";

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
    const inputImagenes = document.getElementById("image-new-product");
    const preview = document.getElementById("preview-new-product");

    if (inputImagenes && inputImagenes.files.length > 0) {
        const file = inputImagenes.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            data.picture = e.target.result;

            preview.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 1rem;">Información del producto</h2>
                ${productDetailView(data)}
            `;

            preview.classList.remove("d-none");
            preview.style.display = "block";
            preview.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        reader.readAsDataURL(file);
    } else {
        // Si no hay imagen, solo muestra el resto
        preview.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 1rem;">Información del producto</h2>
            ${productDetailView(data)}
        `;

        preview.classList.remove("d-none");
        preview.style.display = "block";
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

    let picture = "";
    const inputImagenes = document.getElementById("image-new-product");
    if (inputImagenes && inputImagenes.files.length > 0) {
        picture = inputImagenes.files[0].name;
    }

    return {
        name: document.getElementById("name-new-product").value.trim(),
        description: document.getElementById("description-new-product").value.trim(),
        pricing: document.getElementById("price-new-product").value,
        discount: document.getElementById("discount-new-product").value,
        price_discount: document.getElementById("price-discount-new-product").value,
        sales_format: document.getElementById("price-format-new-product").value,
        category: document.getElementById("category-new-product").value,
        country: document.getElementById("country-new-product").value,
        state: document.getElementById("state-new-product").value,
        sku: document.getElementById("sku-new-product").value,
        stock: Number(document.getElementById("stock-new-product").value) > 0,
        permitirReservas: document.getElementById("allow-reserve") ? document.getElementById("allow-reserve").value : null,
        umbral: document.getElementById("stock-threshold") ? document.getElementById("stock-threshold").value : null,
        peso: document.getElementById("weight-new-product") ? document.getElementById("weight-new-product").value : null,
        dimensiones: dimensionesInputs.length > 0 ? Array.from(dimensionesInputs).map(input => input.value) : [],
        picture: picture
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

const inputImagen = document.getElementById("image-new-product");
const btnEliminarImagen = document.getElementById("remove-image-btn");

inputImagen.addEventListener("change", () => {
    if (inputImagen.files.length > 0) {
        btnEliminarImagen.classList.remove("d-none");
    } else {
        btnEliminarImagen.classList.add("d-none");
    }
});

btnEliminarImagen.addEventListener("click", () => {
    inputImagen.value = ""; // limpia el input
    btnEliminarImagen.classList.add("d-none"); // oculta el botón
});