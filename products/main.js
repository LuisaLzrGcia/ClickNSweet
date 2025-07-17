import { products } from "../data/db.js";

document.addEventListener("DOMContentLoaded", function () {
    getProducts();
});

const getProducts = async () => {
    const container = document.getElementById('container-products');
    container.innerHTML = "<p>Cargando productos...</p>";

    let productsContainer = "";
    products.map((item, index) => {
        const truncateName = truncateText(item.name, 30)
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
        let status = "";
        if (item.stock == true) {
            status = `<p class="status">Disponible</p>`
        } else {
            status = `<p class="status">No disponible</p>`
        }
        productsContainer += `
       <div class="card-product">
            <div class="card mb-3">
              <div class="d-flex flex-column m-2 h-100" data-id="${item.id}" data-name="${item.name}"
                data-pricing="${item.pricing}" data-category="${item.category}" data-description="${item.description}"
                data-origen="${item.origen}" data-picture="${item.picture}" data-sales_format="${item.sales_format}"
                data-discount="${item.discount}" data-price_discount="${item.price_discount}"
                data-rating="${item.rating}" data-country="${item.country}" data-stock="${item.stock}"
                onclick="viewDetails(this)">
                <div class="img-wrapper">
                  <img src="${item.picture}"
                    class="card-img-top img-fill" alt="...">
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">
                    ${truncateName}</h5>
                  <div class="star-rating mb-1">${renderStars(item.rating)}</div>
                  <div class="price-container">${priceData}</div>
                  <div class="sales-format text-muted mb-2">Formato de venta: ${item.sales_format}</div>
                  ${status}
                </div>
              </div>
              <div class="btn-container mt-auto">
                <button class="btn btn-pink-cart" data-id="${item.id}" data-name="${item.name}"
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
    container.innerHTML = productsContainer
}

function renderStars(rating) {
    let starsHtml = "";
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="bi bi-star-fill"></i>';
    }

    if (halfStar === 1) {
        starsHtml += '<i class="bi bi-star-half"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="bi bi-star"></i>';
    }

    return starsHtml;
}


function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength - 3) + '...';
}