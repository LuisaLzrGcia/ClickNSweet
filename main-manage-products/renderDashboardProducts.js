import { renderStars } from "../functions/renderStars.js";

export function renderDashboardProducts(productsArray) {
  let html = "";
  productsArray.forEach((product) => {
    const priceFormat = product.pricing.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    const inactiveClass = product.status === "inactive" ? " inactive" : "";
    // const inactiveClass = '';

    const discountFormat = product.price_discount.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

        // URL normal (picture) o Base64 (image) → src usable por <img>
    function resolveProductImage(product) {
    const pic = product?.picture?.trim?.();
    if (pic) return pic; // ya puede ser URL o "data:image/...;base64,..."

    const b64 = product?.image && String(product.image).trim();
    if (b64) {
        // Ajusta si tu backend envía otro mime; por defecto, jpeg
        const mime = product.imageMimeType || "image/jpeg";
        return `data:${mime};base64,${b64}`;
    }

    // Fallback opcional
    return "/assets/img/placeholder-product.png";
    }

    html += `
      <div class="col-12 product-card-container">
    <div class="card shadow-sm p-3 border-0 rounded-4 h-100 product-card${inactiveClass}" data-product-id="${product.id}">
        <div class="row g-3 align-items-center h-100">
            <!-- Sección de imagen -->
            <div class="col-md-4 inactive">
                <div class="position-relative h-100">
                    <img src="${resolveProductImage(product)}" class="img-fluid rounded-4 object-fit-cover w-100 h-100 product-image"
                        style="min-height: 200px; max-height: 250px" alt="${product.name}" loading="lazy" />
                    <!-- Badge de descuento -->
                    ${
                      product.discount > 0
                        ? `
                    <span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end"
                        style="font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)">
                        -${product.discount}% OFF
                    </span>
                    `
                        : ""
                    }
                    <!-- Badge especial para admin -->
                    <span class="position-absolute bottom-0 start-0 bg-dark text-white px-2 py-1 rounded-top-end"
                        style="font-size: 0.8rem">
                        <i class="bi bi-shield-lock me-1"></i>Admin Mode
                    </span>
                </div>
            </div>

            <!-- Sección de contenido -->
            <div class="col-md-8">
                <div class="inactive">
                    <!-- Encabezado -->
                    <div class="d-flex flex-wrap justify-content-between align-items-start mb-2 gap-2">
                        <span class="category badge text-dark text-uppercase fs-xxs">${product.category}</span>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-geo-alt-fill text-muted me-1"></i>
                            <small class="text-muted">${product.country}</small>
                        </div>
                    </div>

                    <!-- Estado y stock - Versión mejorada para admin -->
                    <div class="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-2">
                        <div class="d-flex align-items-center">
                            <span class="text-success fw-semibold">Stock Adecuado</span>
                            <i class="bi bi-patch-check-fill text-success ms-1"></i>
                        </div>
                        <div class="d-flex align-items-center py-1 rounded-pill">
                            <i class="bi bi-box-seam text-muted me-2"></i>
                            <span class="text-muted me-1">Unidades disponibles:</span>
                            <strong class="text-dark">${product.stock}</strong>
                        </div>
                    </div>

                    <!-- Nombre y rating - Solución para el problema de las estrellas -->
                    <div
                        class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
                        <h3 class="h5 card-title mb-0 text-truncate flex-grow-1 pe-2" style="max-width: 70%"
                            title="${product.name}">
                            ${product.name}
                        </h3>
                        <div class="d-flex align-items-center py-1 rounded-pill rating-container">
                            <div class="text-warning me-1">${renderStars(product.rating)}</div>
                            <small class="text-muted fw-bold">${product.rating.toFixed(1)}</small>
                        </div>
                    </div>

                    <!-- Descripción -->
                    <p class="text-muted mb-4 product-description">
                        ${product.description}
                    </p>

                    <!-- Precios - Versión mejorada para admin -->
                    <div class="row g-2 mb-4">
                        <div class="col-md-4">
                            <div class="precio p-3 rounded-3 h-100 d-flex flex-column">
                                <small class="mb-1">Precio base</small>
                                <span class="text-dark fw-bold fs-5">${priceFormat}</span>
                                <small class="text-muted mt-1">Costo: $${(product.pricing * 0.7).toFixed(2)}</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="precio p-3 rounded-3 h-100 d-flex flex-column">
                                <small class="mb-1">Margen</small>
                                <span class="text-pink fw-bold fs-5">$${(product.pricing * 0.3).toFixed(2)} (30%)</span>
                                <small class="text-muted mt-1">Descuento: ${product.discount}%</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div
                                class="precio p-3 rounded-3 h-100 d-flex flex-column border border-primary border-opacity-25">
                                <small class="mb-1">Precio final</small>
                                <span class="text-dark fw-bold fs-5">${discountFormat}</span>
                                <small class="text-pink mt-1">Ganancia: $${(product.pricing * 0.3 * (1 - product.discount / 100)).toFixed(2)}</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Acciones administrativas mejoradas -->
                <div
                    class="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top buttons-admin-dashboard">
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-sm btn-pink d-flex align-items-center me-3 edit-button-admin">
                            <i class="bi bi-pencil-fill me-1"></i>Editar
                        </button>
                        <div class="form-check form-switch d-flex align-items-center">
                            <input class="form-check-input custom-switch" type="checkbox" id="toggle-${product.id}"
                                data-product-id="${product.id}" ${
      product.status === "inactive" ? "" : "checked"
    } style="width: 2.5em; height: 1.3em" />
                            <label class="form-check-label small ms-2 switch-state-text"
                                for="toggle-${product.id}"></label>
                        </div>
                    </div>

                    <div class="d-flex align-items-center ms-auto gap-2">
                        <button class="btn btn-sm d-flex align-items-center btn-eliminar">
                            <i class="bi bi-trash-fill me-1"></i>Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
  });
  return html;
}
