import { renderStars } from "../functions/renderStars.js";

export const productDetailView = (data, type = "detail") => {
  const tieneImagen = data.picture && data.picture.trim() !== "";
  const imagenHTML = tieneImagen
    ? `<div class="position-relative">
        <img src="${data.picture}" alt="Imagen del producto"
          class="img-fluid rounded-3 w-100 shadow-sm" style="object-fit: cover;">
        ${!data.stock ? '<span class="status-product">Agotado</span>' : ''}
      </div>`
    : `<div class="bg-light d-flex align-items-center justify-content-center rounded-3 shadow-sm w-100" style="height: 400px; position: relative;">
        <span class="text-muted">Sin imagen</span>
        ${!data.stock ? '<span class="status-product">Agotado</span>' : ''}
      </div>`;


  const descuento = parseFloat(data.discount) || 0;
  const precio = parseFloat(data.pricing) || 0;
  const precioOferta = parseFloat(data.price_discount) || 0;

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

  const showButton = type === "detail" ? `
    <div class="d-grid gap-2 mt-4">
      <button class="btn btn-pink-cart text-white py-2 px-4" type="button"
      ${!data.stock ? 'disabled' : ''}
            data-id="${data.id}" data-name="${data.name}"
            data-pricing="${data.pricing}" data-category="${data.category}" data-description="${data.description}"
            data-origen="${data.origen}" data-picture="${data.picture}" data-sales_format="${data.sales_format}"
            data-discount="${data.discount}" data-price_discount="${data.price_discount}"
            data-rating="${data.rating}" data-country="${data.country}" data-stock="${data.stock}"
            onclick="addCart(this)"
            >
        <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
      </button>
    </div>
  ` : "";

  const html = `
    <div class="row g-4 align-items-start p-4">
      <!-- Imagen del producto -->
      <div class="col-md-6">
        ${imagenHTML}
      </div>

      <!-- Detalles del producto -->
      <div class="col-md-6">
        <h2 class="mb-3 text-fuchsia">${data.name || "Nombre del producto"}</h2>

        <!-- Calificación -->
        <div class="star-rating mb-2 text-warning fs-5">
          ${renderStars(data.rating || 0)}
        </div>

        <!-- Precios y descuento -->
        <div class="mb-3">
          ${priceData}
        </div>

        <div class="row mb-3">
          <!-- Presentación -->
          <div class="col-12 col-md-6 mb-3 mb-md-0">
            <p class="fw-semibold text-muted mb-1">Presentación:</p>
            <p class="text-dark mb-0 formatSaleBadge">${data.sales_format || "N/A"}</p>
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
        <p class="text-muted">${data.description || "Sin descripción del producto."}</p>

        <!-- Información adicional -->
        <div class="mt-4 text-muted small d-flex flex-column gap-1 category">
          <p class="mb-1">
            <strong>Categoría:</strong>
            <span class="badge pastel-creamy text-dark fs-6">${data.category || "No definida"}</span>
          </p>

          <p class="mb-1">
            <strong>Origen:</strong>
            <span class="badge bg-pastel-green text-dark">
              ${data.country || "Desconocido"}
            </span>
          </p>

          <p class="mb-0">
          <strong>Disponibilidad:</strong>
          <span class="badge bg-mint-light text-dark">
            ${
              data.stock
                ? data.inStock
                  ? "En stock"
                  : "Pocas unidades"
                : "Agotado"
            }
          </span>
        </p>

        </div>

        <!-- Botón de añadir al carrito -->
        <div class="d-grid gap-2 mt-4">
          ${showButton}
        </div>
      </div>
    </div>`;

  return html;
}
