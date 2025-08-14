import { renderStars } from "../functions/renderStars.js";

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
  const descuento = parseFloat(data.discountValue) > 0
    ? Math.round(parseFloat(data.discountValue))
    : 0;

  const precioOferta = descuento > 0
    ? Math.round(precio - descuento)
    : precio;


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



  const html = `
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

        <!-- Botón de añadir al carrito -->
        <div class="d-grid gap-2 mt-4">
          ${showButton}
        </div>
      </div>
    </div>`;

  return html;
}


document.addEventListener("DOMContentLoaded", () => {
  const productId = "mooncake";
  const storageKey = `reviews_${productId}`;
  const reviewsContainer = document.getElementById("reviews-container");
  const loadMoreButton = document.getElementById("load-more-reviews");
  const averageStarsContainer = document.getElementById("average-stars");
  const reviewCountContainer = document.getElementById("review-count");

  const defaultReviews = [
    {
      id_user: 1,
      name_user: "María López",
      id_product: "mooncake",
      id_review: 101,
      rating: 5,
      comment: "¡Delicioso! La textura es perfecta y el sabor increíble."
    },
    {
      id_user: 2,
      name_user: "Juan Pérez",
      id_product: "mooncake",
      id_review: 102,
      rating: 4,
      comment: "Muy bueno, aunque un poco dulce para mi gusto."
    },
    {
      id_user: 3,
      name_user: "Ana Rodríguez",
      id_product: "mooncake",
      id_review: 103,
      rating: 3,
      comment: "Lo compré para una reunión y todos quedaron encantados."
    },
    {
      id_user: 4,
      name_user: "Carlos Méndez",
      id_product: "mooncake",
      id_review: 104,
      rating: 4,
      comment: "Buen sabor, buena presentación. Volvería a comprar."
    }
  ];

  if (!localStorage.getItem(storageKey)) {
    localStorage.setItem(storageKey, JSON.stringify(defaultReviews));
  }

  const reviews = JSON.parse(localStorage.getItem(storageKey)) || [];
  let reviewsToShow = 3;
  renderHeader();
  renderReviews();

  function renderHeader() {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    if (averageStarsContainer) {
      averageStarsContainer.innerHTML = renderStars(avgRating);
    }
    if (reviewCountContainer) {
      reviewCountContainer.textContent = `Total de calificaciones (${reviews.length})`;
    }
  }

  function renderReviews() {
    reviewsContainer.innerHTML = "";

    reviews.slice(0, reviewsToShow).forEach((review) => {
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("review-item");
      reviewDiv.innerHTML = `
        <p class="reviewer-name"><strong>${review.name_user}</strong></p>
        <p class="review-stars">${renderStars(review.rating)}</p>
        <p class="review-text">${review.comment}</p>
      `;
      reviewsContainer.appendChild(reviewDiv);
    });

    loadMoreButton.style.display = reviewsToShow < reviews.length ? "block" : "none";
  }

  loadMoreButton.addEventListener("click", () => {
    reviewsToShow += 3;
    renderReviews();
  });
});

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
