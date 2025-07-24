import { renderStars } from "../functions/renderStars.js";

export const productDetailView = (data) => {

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

        return html;
}