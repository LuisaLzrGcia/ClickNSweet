import { products } from "../data/db.js";
import { renderStars } from "../functions/renderStars.js";

document.addEventListener("DOMContentLoaded", function () {
  getProducts();
});

const getProducts = async () => {
  const container = document.getElementById('container-products');
  const productsArray = products
  container.innerHTML = renderProducts(productsArray);

}


function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

document.getElementById('sort-new').addEventListener('click', () => {
  renderProducts([...products].reverse()); // Si los nuevos están al final
});

document.getElementById('sort-price-asc').addEventListener('click', () => {
  const sorted = [...products].sort((a, b) => a.price_discount - b.price_discount);
  renderProducts(sorted);
});

document.getElementById('sort-price-desc').addEventListener('click', () => {
  const sorted = [...products].sort((a, b) => b.price_discount - a.price_discount);
  renderProducts(sorted);
});

document.getElementById('sort-rating').addEventListener('click', () => {
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  renderProducts(sorted);
});


function renderProducts(productsArray) {
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

    productsContainer += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-4 p-1">
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
                <p class="card-text"><strong>Origen:</strong> ${item.origen}</p>
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
