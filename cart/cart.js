import { getCurrentItem } from "../product-detail/getCurrentItem.js";

let descuentoFijoGlobal = 0;
let descuentoPorcentajeGlobal = 0;

let cartItemsCache = []; // global

document.addEventListener("DOMContentLoaded", async function () {
  bloquearBotonPago(); // bloquear al inicio mientras cargan datos
  const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsCache = await getCartItemsArray(cartLS);
  await renderCartItems(cartItemsCache);
  setupDeleteButtons();
  desbloquearBotonPago(); // desbloquear al terminar
});

async function renderCartItems(cartItems) {
  bloquearBotonPago(); // bloquear mientras se renderiza

  const cartContainer = document.getElementById("cart-container");

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div id="cart-items-null" class="cart-items">
          No hay productos en el carrito.
          <br><br>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor"
              class="bi bi-cart4" viewBox="0 0 16 16">
              <path
                  d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
          </svg>
      </div>
    `;
    actualizarResumenCompra(cartItems);
    actualizarCuponAplicado(cartItems);
    desbloquearBotonPago();
    return;
  }

  let cartItemsArray = await getCartItemsArray(cartItems);
  let cartHTML = "";

  for (const [index, item] of cartItemsArray.entries()) {
    cartHTML += cartItem(item, item.quantity);
    if (index !== cartItemsArray.length - 1) cartHTML += '<hr>';
  }

  cartContainer.innerHTML = cartHTML;

  setupCartInteractivity(cartItemsArray);
  actualizarResumenCompra(cartItemsArray);
  actualizarCuponAplicado(cartItemsArray);

  desbloquearBotonPago(); // desbloquear cuando termina
}

async function getCartItemsArray(items) {
  let cartItemsArray = [];
  for (const element of items) {
    const data = await getCurrentItem(element.id);
    if (!data) continue;
    data.quantity = element.quantity;
    cartItemsArray.push(data);
  }
  return cartItemsArray;
}

function cartItem(item, quantity) {
  const hasDiscount = item.discountValue > 0;
  const priceUnit = item.price;
  const discountPercentage = hasDiscount ? Math.round(item.discountValue) : 0;
  const priceDiscount = hasDiscount
    ? priceUnit - Math.round((priceUnit * item.discountValue) / 100)
    : priceUnit;
  const priceFinal = Math.round(priceDiscount * quantity);
  let imgSrc = item.image ? `data:image/jpeg;base64,${item.image}` : '../assets/default.jpg'
  return `
  <div class="row cart-item rounded p-3 mb-3 align-items-center" data-id="${item.id}" data-name="${item.productName}">
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
                  <span class="text-danger fw-semibold ms-1">-${discountPercentage}%</span>` : `$${priceUnit.toFixed(2)}`}</p>
              <p class="precio-final fw-bold mb-1">$${priceFinal}</p>
              <button class="btn btn-sm eliminar-item" data-id="${item.id}">
                <img src="../assets/remove.webp" alt="Eliminar" class="trash-img" style="width: 20px;">
              </button>
          </div>
      </div>
  </div>`;
}

function setupCartInteractivity(items) {
  document.querySelectorAll(".cart-item").forEach((itemEl) => {
    const input = itemEl.querySelector(".quantity-input");
    const plus = itemEl.querySelector(".btn-plus");
    const minus = itemEl.querySelector(".btn-minus");
    const precioFinal = itemEl.querySelector(".precio-final");
    const precioUnitario = parseFloat(itemEl.querySelector(".precio-unitario").textContent);
    const itemId = itemEl.getAttribute("data-id");
    const itemData = items.find(i => String(i.id) === String(itemId));
    if (!itemData) return;

    const updatePrecio = () => {
      const cantidad = parseInt(input.value);
      const total = (precioUnitario * cantidad).toFixed(2);
      precioFinal.textContent = `$${total}`;
      itemData.quantity = cantidad;

      const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
      const indexLS = cartLS.findIndex(i => String(i.id) === String(itemId));
      if (indexLS !== -1) {
        cartLS[indexLS].quantity = cantidad;
        localStorage.setItem("cart", JSON.stringify(cartLS));
      }

      actualizarResumenCompra(items);
      actualizarCuponAplicado(items);
    };

    plus.addEventListener("click", () => {
      input.value = parseInt(input.value) + 1;
      updatePrecio();
    });
    minus.addEventListener("click", () => {
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updatePrecio();
      }
    });

    updatePrecio();
  });
}

function obtenerSubtotal(cartItems) {
  let subtotal = 0;
  cartItems.forEach(item => {
    const priceUnit = item.price || 0;
    const hasDiscount = item.discountValue > 0;
    const priceDiscount = hasDiscount
      ? priceUnit - (priceUnit * (item.discountValue / 100))
      : priceUnit;
    subtotal += priceDiscount * (item.quantity || 1);
  });
  return Math.round(subtotal);
}

function actualizarResumenCompra(cartItems) {
  bloquearBotonPago();

  let subtotal = obtenerSubtotal(cartItems);
  let precioOriginalTotal = 0;
  let hayDescuento = false;

  cartItems.forEach(item => {
    precioOriginalTotal += (item.price || 0) * (item.quantity || 1);
    if (item.discountValue && item.discountValue > 0) hayDescuento = true;
  });

  const originalContainer = document.getElementById('original-price-container');
  const originalPriceEl = document.getElementById('original-price');
  if (hayDescuento || descuentoFijoGlobal > 0 || descuentoPorcentajeGlobal > 0) {
    originalContainer.style.display = 'flex';
    originalPriceEl.textContent = `$${precioOriginalTotal.toFixed(2)}`;
  } else {
    originalContainer.style.display = 'none';
  }

  document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;

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

  actualizarCuponAplicado(cartItems);

  desbloquearBotonPago();
}

// Cupones
document.getElementById('apply-coupon-btn').addEventListener('click', async () => {
  const input = document.getElementById('coupon-input');
  const code = input.value.trim().toUpperCase();
  const messageEl = document.getElementById('coupon-message');

  let descuento = 0;
  let tipoDescuento = '';

  if (code === 'SWEET100') {
    descuento = 100;
    tipoDescuento = 'fijo';
  } else if (code === 'SWEET200') {
    descuento = 200;
    tipoDescuento = 'fijo';
  } else if (code === 'CLICK10') {
    descuento = 10;
    tipoDescuento = 'porcentaje';
  } else if (code === 'CLICK20') {
    descuento = 20;
    tipoDescuento = 'porcentaje';
  } else {
    messageEl.textContent = 'Cupón inválido';
    return;
  }

  messageEl.textContent = 'Cupón aplicado correctamente!';
  localStorage.setItem('discountCode', code);
  localStorage.setItem('discountValue', descuento);
  localStorage.setItem('discountType', tipoDescuento);
  input.value = '';

  // Obtener carrito actualizado del localStorage
  const cartLS = JSON.parse(localStorage.getItem("cart")) || [];
  const items = await getCartItemsArray(cartLS);

  renderCartItems(cartItemsCache); // ahora sí pasamos el carrito actual
});


function actualizarCuponAplicado(items) {
  bloquearBotonPago(); // bloquea
  const discountCode = localStorage.getItem('discountCode');
  if (discountCode) {

    const discountCouponBtn = document.getElementById('discount-coupon-btn');
    discountCouponBtn.innerHTML = `
    <div class="badge bg-fuchsia d-inline-flex align-items-center gap-2 p-2">
      <span>${discountCode}</span>
      <button id="remove-coupon-btn" class="btn-close btn-close-white" aria-label="Eliminar cupón" style="font-size: .8rem;"></button>
    </div>
  `;

    // Evento para quitar el cupón
    document.getElementById('remove-coupon-btn').addEventListener('click', () => {
      localStorage.removeItem('discountCode');
      localStorage.removeItem('discountValue');
      localStorage.removeItem('discountType');

      // Limpia el contenido del cupón
      document.getElementById('discount-coupon-btn').innerHTML = '';
      document.getElementById('code-coupon').innerHTML = 'Cupón:';
      document.getElementById('discount-coupon').innerHTML = '$0.00';
      document.getElementById('coupon-message').textContent = '';

      // Actualiza el carrito
      renderCartItems(items);
    });

    const discountElement = document.getElementById('code-coupon');
    const discountValue = document.getElementById('discount-coupon');

    const descuentoCarrito = obtenerSubtotal(items || []);

    discountElement.innerHTML = `Cupón: <strong>${discountCode}</strong>`;
    if (localStorage.getItem('discountType') == 'fijo') {
      discountValue.innerHTML = formatCurrency(parseFloat(localStorage.getItem('discountValue')));
    } else {
      const porcentaje = parseFloat(localStorage.getItem('discountValue'));
      const montoDescuento = (porcentaje / 100) * descuentoCarrito;

      discountValue.innerHTML = `<strong>-${porcentaje}% </strong>(${formatCurrency(montoDescuento)})`;

    }
  }
  renderCartItems(items)
  desbloquearBotonPago();
}


function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

document.getElementById('button-to-pay').addEventListener('click', function (event) {
  // Optionally prevent default navigation
  // event.preventDefault();
  bloquearBotonPago(); // bloquea
  // Get values and parse numbers (remove $ and commas)
  const total = parseFloat(document.getElementById('total-price').textContent.replace('$', '').replace(',', '')) || 0;
  const subtotal = parseFloat(document.getElementById('subtotal-price').textContent.replace('$', '').replace(',', '')) || 0;
  const originalPrice = parseFloat(document.getElementById('original-price').textContent.replace('$', '').replace(',', '')) || 0;

  // Get discount value from discount-coupon element (could be % or fixed)
  let discountStr = document.getElementById('discount-coupon').textContent || '';
  let discount = 0;

  // Extract numeric value from string
  const match = discountStr.match(/[\d\.]+/);
  if (match) {
    discount = parseFloat(match[0]) || 0;
  }

  // Create payment summary object
  const paymentSummary = {
    total: total,
    subtotal: subtotal,
    originalPrice: originalPrice,
    discount: discount
  };

  // Save to localStorage
  localStorage.setItem('paymentSummary', JSON.stringify(paymentSummary));

  // Allow navigation or prevent if needed
  // event.preventDefault();
  desbloquearBotonPago();
});


function setupDeleteButtons() {
  document.querySelectorAll(".eliminar-item").forEach(button => {
    button.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");

      // Obtener y filtrar el carrito
      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems = cartItems.filter(item => String(item.id) !== String(itemId));

      // Guardar en localStorage
      localStorage.setItem("cart", JSON.stringify(cartItems));

      // Eliminar el elemento HTML del DOM
      const itemElement = this.closest(".cart-item");
      if (itemElement) {
        itemElement.remove();
      }

      // Actualizar resumen del carrito
      actualizarResumenCompra(cartItems);
    });
  });
}

const buttonToPay = document.getElementById('button-to-pay');
const originalButtonText = buttonToPay.textContent; // guardamos el texto original

function bloquearBotonPago() {
  buttonToPay.classList.add('disabled'); // desactiva visualmente
  buttonToPay.setAttribute('aria-disabled', 'true');
  buttonToPay.style.pointerEvents = 'none'; // evita clics
  buttonToPay.textContent = 'Cargando...'; // cambiamos el texto mientras carga
}

function desbloquearBotonPago() {
  buttonToPay.classList.remove('disabled');
  buttonToPay.removeAttribute('aria-disabled');
  buttonToPay.style.pointerEvents = 'auto'; // habilitamos clics
  buttonToPay.textContent = originalButtonText; // restauramos el texto original
}
