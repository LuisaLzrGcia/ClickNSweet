// product-detail/productDetailView.js
import { renderStars } from "../functions/renderStars.js";
import fetchData from "../fetchData/fetchData.js";

/** ====== CUADRO DEL PRODUCTO (solo producto, sin reseñas) ====== */
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
            onclick="addCart(this)">
        <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
      </button>
    </div>
  ` : "";

  return `
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
            <label class="form-label fw-semibold text-muted">Cantidad:</label>
            <select class="form-select w-100" id="cantidad">
              ${[...Array(10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
          </div>
        </div>

        <p class="text-muted">${data.description || "Sin descripción del producto."}</p>

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
              ${data.stock ? (data.inStock ? "En stock" : "Pocas unidades") : "Agotado"}
            </span>
          </p>
        </div>

        ${showButton}
      </div>
    </div>
  `;
};

/** ====== CUADRO DE RESEÑAS (solo reseñas, mismo markup/IDs) ====== */
export const productReviewsView = () => `
  <section class="reviews-section">
    <div class="reviews-grid">
      <div class="reviews-summary-box">
        <h2>Opiniones del producto</h2>
        <div id="average-stars" class="stars">★★★★★</div>
        <div id="review-count" class="review-count">(0)</div>
      </div>
      <div class="reviews-list-box">
        <div id="reviews-container"></div>
        <button id="load-more-reviews" style="display:none;">Mostrar más</button>
      </div>
    </div>
  </section>
`;

/** ====== LÓGICA para cargar y pintar reseñas (fetch + render) ====== */
let _allReviews = [];
let _reviewsToShow = 3;

export async function initProductReviews(product) {
  const reviewsContainer = document.getElementById("reviews-container");
  const loadMoreButton = document.getElementById("load-more-reviews");
  const averageStarsContainer = document.getElementById("average-stars");
  const reviewCountContainer = document.getElementById("review-count");

  if (!product?.id) {
    _renderHeader(averageStarsContainer, reviewCountContainer);
    if (reviewsContainer) reviewsContainer.innerHTML = "<p>Sin reseñas.</p>";
    if (loadMoreButton) loadMoreButton.style.display = "none";
    return;
  }

  try {
    const list = await fetchData(`/comments/product/${product.id}`, "GET");
    _allReviews = (list || []).map(r => ({
      name_user: r?.user?.firstName || "Usuario",
      rating: r?.rating || 0,
      comment: r?.commentDetail || ""
    }));
  } catch (err) {
    console.error("Error cargando reseñas:", err);
    _allReviews = [];
  }

  _renderHeader(averageStarsContainer, reviewCountContainer);
  _renderReviews(reviewsContainer, loadMoreButton);

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      _reviewsToShow += 3;
      _renderReviews(reviewsContainer, loadMoreButton);
    });
  }
}

function _renderHeader(avgEl, countEl) {
  const total = _allReviews.length;
  const avg = total > 0 ? _allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total : 0;
  if (avgEl) avgEl.innerHTML = renderStars(avg);
  if (countEl) countEl.textContent = `(${total})`;
}

function _renderReviews(container, loadMoreBtn) {
  if (!container) return;
  const slice = _allReviews.slice(0, _reviewsToShow);
  container.innerHTML = slice.length === 0
    ? "<p>Sin reseñas aún. ¡Sé el primero en opinar!</p>"
    : slice.map(r => `
        <div class="review-item">
          <p class="reviewer-name"><strong>${_esc(r.name_user)}</strong></p>
          <p class="review-stars">${renderStars(r.rating || 0)}</p>
          <p class="review-text">${_esc(r.comment || "")}</p>
        </div>
      `).join("");

  if (loadMoreBtn) {
    loadMoreBtn.style.display = _reviewsToShow < _allReviews.length ? "inline-block" : "none";
  }
}

const _esc = s => String(s)
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
  .replaceAll('"',"&quot;").replaceAll("'","&#39;");




