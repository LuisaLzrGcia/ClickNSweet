import { renderStars } from "./renderStars.js";

export function renderProducts(productsArray, type = "products") {
    let productsContainer = "";
    productsArray.map((item, index) => {
        const truncateName = truncateText(item.name, 40)
        const pricing = item.pricing;
        const pricingFormat = pricing.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
        const priceDiscount = item.price_discount;
        const priceDiscountFormat = priceDiscount.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
        let priceData = ""
        if (item.discount > 0) {
            priceData = `<p class="text-fuchsia"><span class="discount">${item.discount}% OFF</span> <strong>Promoción</strong></p>
            <span class="new-price">${priceDiscountFormat}</span> <span class="old-price">${pricingFormat}</span>`
        } else {
            priceData = `<span class="normal-price">${priceDiscountFormat}</span>`
        }

        const columnsContainer = type === "products" ? "col-12 col-sm-6 col-md-4 col-lg-4 p-1" : "col-12 col-sm-6 col-md-3 col-lg-3 p-1";  

        productsContainer += `
      <div class="${columnsContainer} p-1">
        <div class="card">
          <div class="card-product"
          data-id="${item.id}" data-name="${item.name}"
          data-pricing="${item.pricing}" data-category="${item.category}" data-description="${item.description}"
          data-origen="${item.origen}" data-picture="${item.picture}" data-sales_format="${item.sales_format}"
          data-discount="${item.discount}" data-price_discount="${item.price_discount}"
          data-rating="${item.rating}" data-country="${item.country}" data-stock="${item.stock}"
          onclick="viewDetails(this)">
            <div class="img-wrapper">
              ${!item.stock ? '<span class="status-product">Agotado</span>' : ''}
              <img src="${item.picture}"
                class="card-img-top img-fill" alt="${item.name}">
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${truncateName}</h5>
              <div class="star-rating mb-1">${renderStars(item.rating)}</div>
              <div class="price-container">
                ${priceData}
              </div>
              <div class="origen">
                <p class="card-text h-auto"><strong>Origen:</strong> ${item.origen} 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                  </svg>
                </p>
              </div>
            </div>
          </div>
          <div class="btn-container">
            <button class="btn btn-pink-cart w-100" ${!item.stock ? 'disabled' : ''}
            data-id="${item.id}" data-name="${item.name}"
            data-pricing="${item.pricing}" data-category="${item.category}" data-description="${item.description}"
            data-origen="${item.origen}" data-picture="${item.picture}" data-sales_format="${item.sales_format}"
            data-discount="${item.discount}" data-price_discount="${item.price_discount}"
            data-rating="${item.rating}" data-country="${item.country}" data-stock="${item.stock}"
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