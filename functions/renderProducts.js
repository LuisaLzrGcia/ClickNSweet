import { renderStars } from "./renderStars.js";

export function renderProducts(productsArray, type = "products") {
  let productsContainer = "";
  console.log(productsArray);

  productsArray.map((item, index) => {
    const truncateName = truncateText(item.productName, 40)
    const pricing = item.price ?? 0; // si es null/undefined, usar 0
    const pricingFormat = pricing.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });

    const priceDiscount = item.discountValue ?? 0; // si es null/undefined, usar 0
    const priceDiscountFormat = priceDiscount.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });


    let discountPercentage = 0;
    let priceData = "";

    if (item.discountValue > 0) {
      discountPercentage = Math.round((item.discountValue / item.price) * 100);

      priceData = `
        <span class="new-price">${priceDiscountFormat}</span> 
        <span class="old-price">${pricingFormat}</span>
    `;
    } else {
      priceData = `<span class="normal-price">${pricingFormat}</span>`;
    }

    let origenData = "";

    if (item.productCountryId) {
      origenData = item.productCountryId.name;
    }

    if (item.productStateId) {
      origenData += origenData ? `, ${item.productStateId.name}` : item.productStateId.name;
    }

    if (!origenData) {
      origenData = "N/A";
    }

    const columnsContainer = type === "products" ? "col-12 col-sm-6 col-md-4 col-lg-4 p-1" : "col-12 col-sm-6 col-md-3 col-lg-3 p-1";

    // Antes de renderizar la imagen
    let pictureSrc = item.image;
    if (!pictureSrc) {
      pictureSrc = "../assets/default.jpg"; // aquí pones tu imagen por defecto real
    } else if (!pictureSrc.startsWith("data:")) {
      // Si tu picture es Base64 pero no tiene el prefix "data:image/..."
      pictureSrc = `data:image/jpeg;base64,${pictureSrc}`;
    }


    productsContainer += `
      <div class="${columnsContainer} p-1">
        <div class="card">
          <div class="card-product"
          data-id="${item.id}"
          data-name="${item.productName}"
          onclick="viewDetails(this)">
            <div class="img-wrapper">
              ${item.discountValue > 0 ? `<span class="discount-product">${Math.round(((item.price - item.discountValue) / item.price) * 100)}% OFF</span>` : ''}
              ${!item.quantityStock > item.lowStockThreshold ? '<span class="status-product">Agotado</span>' : ''}
              <img src="${pictureSrc}"
                class="card-img-top img-fill" alt="${item.productName}">
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${truncateName}</h5>
              <div class="star-rating mb-1">${renderStars(item.averageRating)}</div>
              <div class="price-container">
                ${priceData}
              </div>
              <div class="origen">
                <p class="card-text h-auto"><strong>Origen:</strong> ${origenData} 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg>
                </p>
              </div>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-pink-cart w-100" ${item.quantityStock <= item.lowStockThreshold ? 'disabled' : ''}
            data-id="${item.id}"
            data-name="${item.productName}"
            onclick="addCart(this)">
              Añadir al carrito <i class="bi bi-cart-fill"></i>
            </button>
          </div>
        </div>
      </div>
        `
  })

  return productsContainer;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}