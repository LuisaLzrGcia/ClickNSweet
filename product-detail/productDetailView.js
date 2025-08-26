// product-detail/productDetailView.js
import { renderStars } from "../functions/renderStars.js";
import fetchData from "../fetchData/fetchData.js";

// AÑADE ESTA FUNCIÓN AQUÍ
function _esc(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


export const productDetailView = (data, type) => {
  console.log(data);

  let salesFormat = type == "detail"
    ? (data.productSalesFormatId.name || "N/A")
    : (data.productSalesFormatValue || "N/A");

  let category = type == "detail"
    ? (data.productCategoryId.name || "N/A")
    : (data.productCategoryValue || "N/A");

  let country = type == "detail"
    ? (data.productCountryId?.name || null)
    : (data.productCountryValue || null);

  let state = type == "detail"
    ? (data.productStateId?.name || null)
    : (data.productStateValue || null);

  let locationText = "Desconocido";

  if (country && state) {
    locationText = `${state}, ${country}`;
  } else if (country) {
    locationText = country;
  } else if (state) {
    locationText = state; // opcional si quieres mostrar solo estado
  }
  // --- Imagen ---
  let imagenSrc = "../assets/default.jpg"; // default

  if (type === "detail") {
    if (data.image && data.image.trim() !== "") {
      imagenSrc = data.image.startsWith("data:")
        ? data.image
        : `data:image/jpeg;base64,${data.image}`;
    }
  } else {
    if (data.picture && data.picture.trim() !== "") {
      imagenSrc = data.picture.startsWith("data:")
        ? data.picture
        : `data:image/jpeg;base64,${data.picture}`;
    }
  }

  const imagenHTML = `
    <div class="position-relative bg-light rounded-3 shadow-sm w-100" style="height: 400px; overflow: hidden;">
      <img 
        src="${imagenSrc}" 
        alt="${data.productName}" 
        class="img-fluid w-100 h-100 shadow-sm" 
        style="object-fit: cover;"
      >
      ${data.quantityStock < 1 ? `
        <span class="status-product position-absolute top-0 start-0 m-2 px-2 py-1 bg-danger text-white rounded">
          Agotado
        </span>
      ` : ''}
    </div>
  `;

  const precio = parseFloat(data.price) || 0;
  const descuento = Math.round(((data.price - data.discountValue) / data.price) * 100);

  const precioOferta = data.discountValue;


  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2
  });

  let priceData = "";
  if (data.discountValue > 0) {
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

  const showButton = type == "detail" || type == "" ? `
  <div class="d-grid gap-2 mt-4">
    <button class="btn btn-pink-cart text-white py-2 px-4 btn-add-cart" type="button"
      ${data.quantityStock < 1 ? 'disabled' : ''}
      data-id="${data.id}" 
      data-name="${data.productName}" 
      onclick="addCart(this)">
      <i class="bi bi-cart-plus me-2"></i>
      ${data.quantityStock < 1 ? 'Agotado' : 'Añadir al carrito'}
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
        <h2 class="mb-3 text-fuchsia">${data.productName || "Nombre del producto"}</h2>

        <!-- Calificación -->
        <div class="star-rating mb-2 text-warning fs-5">
          ${renderStars(data.averageRating || 0)}
        </div>

        <!-- Precios y descuento -->
        <div class="mb-3">
          ${priceData}
        </div>

        <div class="row mb-3">
          <!-- Presentación -->
          <div class="col-12 col-md-6 mb-3 mb-md-0">
            <p class="fw-semibold text-muted mb-1">Presentación:</p>
            <p class="text-dark mb-0 formatSaleBadge">${salesFormat || "N/A"}</p>
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
            <span class="badge pastel-creamy text-dark fs-6">${category || "No definida"}</span>
          </p>
          <p class="mb-1">
            <strong>Origen:</strong>
            <span class="badge bg-pastel-green text-dark">
              ${locationText}
            </span>
          </p>
          <p class="mb-0">
          <strong>Disponibilidad:</strong>
          <span class="badge bg-mint-light text-dark">
            ${data.quantityStock == 0
      ? "Agotado"
      : data.quantityStock > data.lowStockThreshold
        ? "En stock"
        : "Pocas unidades"
    }
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

  /* --- CÓDIGO INCORRECTO A ELIMINAR --- */
  // loadMoreButton.addEventListener("click", () => {
  //   reviewsToShow += 3;
  //   renderReviews(); // <--- ¡Esto está mal!
  // });
}; // <-- El punto y coma cierra esta función

function actualizarCantidadBoton() {
  // Obtener select de cantidad y botón
  const selectCantidad = document.getElementById("cantidad");
  const botonCarrito = document.querySelector(".btn-add-cart");

  if (!selectCantidad || !botonCarrito) return;

  // Asignar dataset
  selectCantidad.addEventListener("change", () => {
    botonCarrito.dataset.quantity = selectCantidad.value;
  });

  // Inicialmente asignar 1 por defecto
  botonCarrito.dataset.quantity = selectCantidad.value || 1;
}

// Llamar esta función después de renderizar el producto
document.addEventListener("DOMContentLoaded", () => {
  actualizarCantidadBoton()
});
