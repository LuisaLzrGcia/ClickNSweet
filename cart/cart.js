let descuentoFijoGlobal = 0;
let descuentoPorcentajeGlobal = 0;

document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-container");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  let cartHTML = "";
  cartItems.forEach(item => {
      cartHTML += cartItem(item);
  });

  cartContainer.innerHTML = cartHTML;

  setupCartInteractivity();
  actualizarResumenCompra(cartItems);
});

function cartItem(item) {
  const hasDiscount = item.discount && item.discount > 0;
  const priceUnit = item.pricing;
  const discountAmount = hasDiscount ? (priceUnit * item.discount) / 100 : 0;
  const priceDiscount = hasDiscount ? priceUnit - discountAmount : priceUnit;
  const priceFinal = priceDiscount * item.quantity;

  return `
  <div class="row cart-item border rounded p-3 mb-3 align-items-center" data-id="${item.id}">
      <div class="col-12 col-md-6 mb-3 mb-md-0">
          <div class="row g-3 align-items-center">
              <div class="col-12 col-md-6 text-center">
                  <img src="${item.picture}" alt="${item.name}"
                      class="img-fluid rounded w-100"
                      style="max-height: 150px; object-fit: cover;">
              </div>
              <div class="col-12 col-md-6 text-start">
                  <h5 class="card-title mb-1">${item.name}</h5>
                  <p class="text-muted mb-1">Categoría: ${item.category}</p>
              </div>
          </div>
      </div>
      <div class="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div class="cantidad-container input-group input-group-sm" style="max-width: 120px;">
              <button class="btn btn-outline-secondary btn-minus" type="button">-</button>
              <input type="text" class="form-control text-center quantity-input" value="${item.quantity}" readonly>
              <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
          </div>
          <div class="precio-info d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
              <p class="text-muted mb-0">Precio unitario: 
                  <span class="precio-unitario d-none">${priceDiscount}</span>
                  ${hasDiscount ? `<span class="text-decoration-line-through text-muted">$${priceUnit.toFixed(2)}</span> 
                  <span class="text-danger fw-semibold ms-1">-${item.discount}%</span>` : `$${priceUnit.toFixed(2)}`}
              </p>
              <p class="precio-final fw-bold mb-1">$${priceFinal.toFixed(2)}</p>
              <button class="btn btn-sm eliminar-item">
                  <img src="assets/remove.webp" alt="Eliminar" class="trash-img" style="width: 20px;">
              </button>
          </div>
      </div>
  </div>
  `;
}

function setupCartInteractivity() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  document.querySelectorAll(".cart-item").forEach((itemEl, index) => {
      const input = itemEl.querySelector(".quantity-input");
      const plus = itemEl.querySelector(".btn-plus");
      const minus = itemEl.querySelector(".btn-minus");
      const precioFinal = itemEl.querySelector(".precio-final");
      const precioUnitario = parseFloat(itemEl.querySelector(".precio-unitario").textContent);

      const updatePrecio = () => {
          const cantidad = parseInt(input.value);
          const total = (precioUnitario * cantidad).toFixed(2);
          precioFinal.textContent = `$${total}`;
          cartItems[index].quantity = cantidad;
          localStorage.setItem("cart", JSON.stringify(cartItems));
          actualizarResumenCompra(cartItems);
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

      updatePrecio(); // Inicializa
  });
}

function obtenerSubtotal(cartItems) {
  let subtotal = 0;
  cartItems.forEach(item => {
    const hasDiscount = item.discount && item.discount > 0;
    const priceUnit = item.pricing;
    const discountAmount = hasDiscount ? (priceUnit * item.discount) / 100 : 0;
    const priceDiscount = hasDiscount ? priceUnit - discountAmount : priceUnit;
    subtotal += priceDiscount * item.quantity;
  });
  return subtotal;
}

function actualizarResumenCompra(cartItems) {
  let subtotal = obtenerSubtotal(cartItems);
  let precioOriginalTotal = 0;
  let hayDescuento = false;

  cartItems.forEach(item => {
      precioOriginalTotal += item.pricing * item.quantity;
      if (item.discount && item.discount > 0) hayDescuento = true;
  });

  // Aplica descuentos del cupón
  let subtotalConDescuento = subtotal;
  if (descuentoPorcentajeGlobal > 0) {
    subtotalConDescuento = subtotalConDescuento * (1 - descuentoPorcentajeGlobal / 100);
  } else if (descuentoFijoGlobal > 0) {
    subtotalConDescuento = subtotalConDescuento - descuentoFijoGlobal;
  }
  if (subtotalConDescuento < 0) subtotalConDescuento = 0;

  // Mostrar precio original si hay descuento
  const originalContainer = document.getElementById('original-price-container');
  const originalPriceEl = document.getElementById('original-price');
  if (hayDescuento || descuentoFijoGlobal > 0 || descuentoPorcentajeGlobal > 0) {
      originalContainer.style.display = 'flex';
      originalPriceEl.textContent = `$${precioOriginalTotal.toFixed(2)}`;
  } else {
      originalContainer.style.display = 'none';
  }

  // Mostrar subtotal con descuento
  document.getElementById('subtotal-price').textContent = `$${subtotalConDescuento.toFixed(2)}`;

  // Calcular costo de envío
  const envio = subtotalConDescuento < 500 && subtotalConDescuento > 0 ? 299.00 : 0.00;
  document.getElementById('shipping-cost').textContent = envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`;

  // Total final
  const totalFinal = subtotalConDescuento + envio;
  document.getElementById('total-price').textContent = `$${totalFinal.toFixed(2)}`;
}

// Cupones
document.getElementById('apply-coupon-btn').addEventListener('click', () => {
  const input = document.getElementById('coupon-input');
  const code = input.value.trim().toUpperCase();
  const messageEl = document.getElementById('coupon-message');

  let descuentoFijo = 0;
  let descuentoPorcentaje = 0;

  if(code === 'SWEET100') {
    descuentoFijo = 100;
  } else if(code === 'SWEET200') {
    descuentoFijo = 200;
  } else if(code === 'CLICK10') {
    descuentoPorcentaje = 10;
  } else if(code === 'CLICK20') {
    descuentoPorcentaje = 20;
  } else {
    messageEl.textContent = 'Cupón inválido';
    return;
  }

  messageEl.textContent = 'Cupón aplicado correctamente!';

  // Guarda globalmente para que actualizar resumen use este descuento
  descuentoFijoGlobal = descuentoFijo;
  descuentoPorcentajeGlobal = descuentoPorcentaje;

  // Actualiza el resumen con descuento aplicado
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  actualizarResumenCompra(cartItems);
});
