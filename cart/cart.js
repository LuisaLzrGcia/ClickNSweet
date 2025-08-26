import { getCurrentItem } from "../product-detail/getCurrentItem.js";

let cartItemsCache = []; // cache global del carrito

document.addEventListener("DOMContentLoaded", async function () {
  bloquearBotonPago();
  await renderView();
  desbloquearBotonPago();
});

function noData() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = `
    <div id="cart-items-null" class="cart-items">
        No hay productos en el carrito.
        <br><br>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor"
            class="bi bi-cart4" viewBox="0 0 16 16">
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
        </svg>
    </div>
  `;
}

async function renderCartItems(cartItems) {
  bloquearBotonPago();
  const cartContainer = document.getElementById("cart-container");

  if (!cartItems || cartItems.length < 1) {
    noData();
    desbloquearBotonPago();
    return;
  }

  let cartHTML = "";
  for (const item of cartItems) {
    cartHTML += cartItemHTML(item, item.quantity);
  }
  cartContainer.innerHTML = cartHTML;

  setupDeleteButtons(cartItems);
  setupCartInteractivity(cartItems);
  actualizarResumenCompra(cartItems);

  desbloquearBotonPago();
}

async function getCartItemsArray(items) {
  const array = [];
  for (const element of items) {
    const data = await getCurrentItem(element.id);
    if (!data) continue;
    data.quantity = element.quantity;
    array.push(data);
  }
  cartItemsCache = array;
  return array;
}

function cartItemHTML(item, quantity) {
  const hasDiscount = item.discountValue && item.discountValue > 0;
  const priceUnit = item.price;
  const discountPercentage = hasDiscount ? Math.round(((priceUnit - item.discountValue) / priceUnit) * 100) : 0;
  const priceDiscount = hasDiscount ? item.discountValue : priceUnit;
  const priceFinal = parseFloat(priceDiscount) * parseFloat(quantity);
  const imgSrc = item.image ? `data:image/jpeg;base64,${item.image}` : '../assets/default.jpg';

  return `
  <div class="row cart-item rounded p-3 mb-3 align-items-center" data-id="${item.id}">
      <div class="col-12 col-md-6 mb-3 mb-md-0">
          <div class="row g-3 align-items-center">
              <div class="col-12 col-md-6 text-center">
                  <img src="${imgSrc}" alt="${item.productName}" class="img-fluid rounded w-100" style="max-height: 150px; object-fit: cover;">
              </div>
              <div class="col-12 col-md-6 text-start">
                  <h5 class="card-title mb-1">${item.productName}</h5>
                  <p class="text-muted mb-1">Categoría: ${item.productCategoryId.name}</p>
              </div>
          </div>
      </div>
      <div class="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div class="cantidad-container input-group input-group-sm" style="max-width: 120px;">
              <button class="btn btn-outline-secondary btn-minus" type="button">-</button>
              <input type="text" class="form-control text-center quantity-input" value="${quantity}" readonly>
              <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
          </div>
          <div class="precio-info d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
              <p class="text-muted mb-0">Precio unitario: 
                  <span class="precio-unitario d-none">${priceDiscount}</span>
                  ${hasDiscount ? `<span class="text-decoration-line-through text-muted">$${priceUnit.toFixed(2)}</span> 
                  <span class="text-danger fw-semibold ms-1">${discountPercentage}%</span>` : `$${priceUnit.toFixed(2)}`}</p>
              <p class="precio-final fw-bold mb-1">${priceFinal.toFixed(2)}</p>
              <button class="btn btn-sm eliminar-item" data-id="${item.id}">
                <img src="../assets/remove.webp" alt="Eliminar" class="trash-img" style="width: 20px;">
              </button>
          </div>
      </div>
  </div>
  <hr>`;
}

function setupCartInteractivity(items) {
  document.querySelectorAll(".cart-item").forEach(itemEl => {
    const input = itemEl.querySelector(".quantity-input");
    const plus = itemEl.querySelector(".btn-plus");
    const minus = itemEl.querySelector(".btn-minus");
    const precioFinalEl = itemEl.querySelector(".precio-final");
    const precioUnitario = parseFloat(itemEl.querySelector(".precio-unitario").textContent);
    const itemId = itemEl.getAttribute("data-id");
    const itemData = items.find(i => String(i.id) === String(itemId));
    if (!itemData) return;

    const actualizarCantidad = () => {
      const cantidad = parseInt(input.value);
      itemData.quantity = cantidad;
      const total = (precioUnitario * cantidad).toFixed(2);
      precioFinalEl.textContent = `$${total}`;

      // Actualizar LS
      const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
      const indexLS = cartLS.findIndex(i => String(i.id) === String(itemId));
      if (indexLS !== -1) {
        cartLS[indexLS].quantity = cantidad;
        localStorage.setItem("cart", JSON.stringify(cartLS));
      }

      actualizarResumenCompra(items);
    };

    plus.addEventListener("click", () => { input.value = parseInt(input.value) + 1; actualizarCantidad(); });
    minus.addEventListener("click", () => { if (parseInt(input.value) > 1) { input.value = parseInt(input.value) - 1; actualizarCantidad(); } });

    actualizarCantidad();
  });
}

function obtenerSubtotal(cartItems) {
  return cartItems.reduce((acc, item) => {
    const priceUnit = item.price || 0;
    const priceDiscount = (item.discountValue && item.discountValue > 0) ? item.discountValue : priceUnit;
    return acc + (priceDiscount * (item.quantity || 1));
  }, 0);
}

function actualizarResumenCompra(cartItems) {
  bloquearBotonPago();

  const subtotal = obtenerSubtotal(cartItems);
  const originalTotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  const hayDescuento = cartItems.some(item => item.discountValue && item.discountValue > 0);

  const originalContainer = document.getElementById('original-price-container');
  const originalPriceEl = document.getElementById('original-price');


  originalPriceEl.textContent = `$${originalTotal.toFixed(2)}`;



  if (hayDescuento) {
    originalPriceEl.classList.add('text-decoration-line-through');
  } else {
    originalPriceEl.classList.remove('text-decoration-line-through');
  }



  document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;

  // Calcular descuento de cupón
  let descuentoAplicado = 0;
  const discountType = localStorage.getItem('discountType');
  const discountValue = parseFloat(localStorage.getItem('discountValue'));
  if (discountType === 'fijo') descuentoAplicado = discountValue || 0;
  else if (discountType === 'porcentaje') descuentoAplicado = subtotal * ((discountValue || 0) / 100);
  if (descuentoAplicado > subtotal) descuentoAplicado = subtotal;

  const subtotalConDescuento = subtotal - descuentoAplicado;
  const envio = subtotalConDescuento < 500 && subtotalConDescuento > 0 ? 299.00 : 0.00;

  document.getElementById('shipping-cost').textContent = envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`;
  const totalFinal = subtotalConDescuento + envio;
  document.getElementById('total-price').textContent = `$${totalFinal.toFixed(2)}`;

  actualizarCuponDOM(cartItems);

  desbloquearBotonPago();
}

// Aplicar cupones
document.getElementById('apply-coupon-btn').addEventListener('click', () => {
  const input = document.getElementById('coupon-input');
  const code = input.value.trim().toUpperCase();
  const messageEl = document.getElementById('coupon-message');

  let descuento = 0;
  let tipoDescuento = '';

  if (code === 'SWEET100') { descuento = 100; tipoDescuento = 'fijo'; }
  else if (code === 'SWEET200') { descuento = 200; tipoDescuento = 'fijo'; }
  else if (code === 'CLICK10') { descuento = 10; tipoDescuento = 'porcentaje'; }
  else if (code === 'CLICK20') { descuento = 20; tipoDescuento = 'porcentaje'; }
  else { messageEl.textContent = 'Cupón inválido'; return; }

  messageEl.textContent = 'Cupón aplicado correctamente!';
  localStorage.setItem('discountCode', code);
  localStorage.setItem('discountValue', descuento);
  localStorage.setItem('discountType', tipoDescuento);
  input.value = '';

  actualizarResumenCompra(cartItemsCache);
});

// Actualizar DOM del cupón
function actualizarCuponDOM(cartItems) {
  const discountCode = localStorage.getItem('discountCode');
  const discountCouponBtn = document.getElementById('discount-coupon-btn');
  const discountElement = document.getElementById('code-coupon');
  const discountValueEl = document.getElementById('discount-coupon');

  if (!discountCode) {
    discountCouponBtn.innerHTML = '';
    discountElement.innerHTML = 'Cupón:';
    discountValueEl.innerHTML = '$0.00';
    return;
  }

  discountCouponBtn.innerHTML = `
    <div class="badge bg-fuchsia d-inline-flex align-items-center gap-2 p-2">
      <span>${discountCode}</span>
      <button id="remove-coupon-btn" class="btn-close btn-close-white" aria-label="Eliminar cupón" style="font-size: .8rem;"></button>
    </div>
  `;
  document.getElementById('remove-coupon-btn').addEventListener('click', () => {
    localStorage.removeItem('discountCode');
    localStorage.removeItem('discountValue');
    localStorage.removeItem('discountType');
    actualizarResumenCompra(cartItemsCache);
  });

  const subtotal = obtenerSubtotal(cartItems);

  discountElement.innerHTML = `Cupón: <strong>${discountCode}</strong>`;
  if (localStorage.getItem('discountType') === 'fijo') {
    discountValueEl.innerHTML = formatCurrency(parseFloat(localStorage.getItem('discountValue')));
  } else {
    const porcentaje = parseFloat(localStorage.getItem('discountValue'));
    const montoDescuento = (porcentaje / 100) * subtotal;
    discountValueEl.innerHTML = `<strong>-${porcentaje}% </strong>(${formatCurrency(montoDescuento)})`;
  }
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

async function renderView() {
  const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
  if (cartLS.length === 0) {
    noData();
  } else {
    const productsArray = await getCartItemsArray(cartLS);
    await renderCartItems(productsArray);
  }
}

function setupDeleteButtons(items) {
  document.querySelectorAll(".eliminar-item").forEach(button => {
    button.addEventListener("click", async function () {
      const itemId = this.getAttribute("data-id");
      let cartLS = JSON.parse(localStorage.getItem("cart")) || [];
      cartLS = cartLS.filter(item => String(item.id) !== String(itemId));
      localStorage.setItem("cart", JSON.stringify(cartLS));

      await renderView();
    });
  });
}

// Botón de pago
const buttonToPay = document.getElementById('button-to-pay');
const originalButtonText = buttonToPay.textContent;

function bloquearBotonPago() {
  buttonToPay.classList.add('disabled');
  buttonToPay.setAttribute('aria-disabled', 'true');
  buttonToPay.style.pointerEvents = 'none';
  buttonToPay.textContent = 'Cargando...';
}

function desbloquearBotonPago() {
  buttonToPay.classList.remove('disabled');
  buttonToPay.removeAttribute('aria-disabled');
  buttonToPay.style.pointerEvents = 'auto';
  buttonToPay.textContent = originalButtonText;
}

buttonToPay.addEventListener('click', () => {
  const total = parseFloat(document.getElementById('total-price').textContent.replace('$', '').replace(',', '')) || 0;
  const subtotal = parseFloat(document.getElementById('subtotal-price').textContent.replace('$', '').replace(',', '')) || 0;
  const originalPrice = parseFloat(document.getElementById('original-price').textContent.replace('$', '').replace(',', '')) || 0;

  let discountStr = document.getElementById('discount-coupon').textContent || '';
  let discount = 0;
  const match = discountStr.match(/[\d\.]+/);
  if (match) discount = parseFloat(match[0]) || 0;

  const paymentSummary = { total, subtotal, originalPrice, discount };
  localStorage.setItem('paymentSummary', JSON.stringify(paymentSummary));
});
