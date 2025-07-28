let descuentoFijoGlobal = 0;
let descuentoPorcentajeGlobal = 0;

document.addEventListener("DOMContentLoaded", function () {
  renderCartItems()
});

function renderCartItems() {
  const cartContainer = document.getElementById("cart-container");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  
  cargarCuponesGuardados();

  let cartHTML = "";
  cartItems.forEach((item, index) => {
    cartHTML += cartItem(item);
    if (index !== cartItems.length - 1) {
      cartHTML += '<hr>';
    }
  });


  cartContainer.innerHTML = cartHTML;

  setupCartInteractivity();
  actualizarResumenCompra(cartItems);
  actualizarCuponAplicado();
}



function cargarCuponesGuardados() {
  const cuponesGuardados = JSON.parse(localStorage.getItem('appliedCoupons') || '{}');
  
  if (cuponesGuardados.descuentoFijo) {
    descuentoFijoGlobal = cuponesGuardados.descuentoFijo;
  }
  
  if (cuponesGuardados.descuentoPorcentaje) {
    descuentoPorcentajeGlobal = cuponesGuardados.descuentoPorcentaje;
  }
  
  
  if (cuponesGuardados.codigoCupon) {
    document.getElementById('coupon-input').value = cuponesGuardados.codigoCupon;
    document.getElementById('coupon-message').textContent = 'Cupón aplicado correctamente!';
  }
  
  console.log('🎫 Cupones cargados:', cuponesGuardados);
}

function guardarCupones(codigo, descuentoFijo, descuentoPorcentaje) {
  const cuponesData = {
    codigoCupon: codigo,
    descuentoFijo: descuentoFijo,
    descuentoPorcentaje: descuentoPorcentaje,
    fechaAplicacion: new Date().toISOString()
  };
  
  localStorage.setItem('appliedCoupons', JSON.stringify(cuponesData));
  console.log('💾 Cupones guardados:', cuponesData);
}


function limpiarCupones() {
  localStorage.removeItem('appliedCoupons');
  descuentoFijoGlobal = 0;
  descuentoPorcentajeGlobal = 0;
  document.getElementById('coupon-input').value = '';
  document.getElementById('coupon-message').textContent = '';
  
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  actualizarResumenCompra(cartItems);
  
  console.log('🗑️ Cupones limpiados');
}

function cartItem(item) {
  const hasDiscount = item.discount && item.discount > 0;
  const priceUnit = item.pricing;
  const discountAmount = hasDiscount ? (priceUnit * item.discount) / 100 : 0;
  const priceDiscount = hasDiscount ? priceUnit - discountAmount : priceUnit;
  const priceFinal = priceDiscount * item.quantity;

  return `
  <div class="row cart-item rounded p-3 mb-3 align-items-center" data-id="${item.id}">
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
  </div>  `;
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
      actualizarCuponAplicado();
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


  
  let subtotalConDescuento = subtotal;
  let descuentoAplicado = 0; 
  
  if (descuentoPorcentajeGlobal > 0) {
    descuentoAplicado = subtotalConDescuento * (descuentoPorcentajeGlobal / 100);
    subtotalConDescuento = subtotalConDescuento * (1 - descuentoPorcentajeGlobal / 100);
  } else if (descuentoFijoGlobal > 0) {
    descuentoAplicado = Math.min(descuentoFijoGlobal, subtotalConDescuento);
    subtotalConDescuento = subtotalConDescuento - descuentoFijoGlobal;
  }
  
  if (subtotalConDescuento < 0) subtotalConDescuento = 0;

  

  // Mostrar precio original si hay descuentos por producto

  const originalContainer = document.getElementById('original-price-container');
  const originalPriceEl = document.getElementById('original-price');
  if (hayDescuento || descuentoFijoGlobal > 0 || descuentoPorcentajeGlobal > 0) {
    originalContainer.style.display = 'flex';
    originalPriceEl.textContent = `$${precioOriginalTotal.toFixed(2)}`;
  } else {
    originalContainer.style.display = 'none';
  }


  
  document.getElementById('subtotal-price').textContent = `$${subtotalConDescuento.toFixed(2)}`;

  
  const envio = subtotalConDescuento < 500 && subtotalConDescuento > 0 ? 299.00 : 0.00;
  document.getElementById('shipping-cost').textContent = envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`;


  const totalFinal = subtotalConDescuento + envio;
  document.getElementById('total-price').textContent = `$${totalFinal.toFixed(2)}`;
  
  console.log('💰 Resumen actualizado - Descuento aplicado:', descuentoAplicado);
}



  // Mostrar subtotal sin cupón
  document.getElementById('subtotal-price').textContent = `$${subtotal.toFixed(2)}`;

  // Calcular descuento por cupón
  let descuentoAplicado = 0;
  const discountType = localStorage.getItem('discountType');
  const discountValue = parseFloat(localStorage.getItem('discountValue'));

  if (discountType === 'fijo') {
    descuentoAplicado = discountValue;
  } else if (discountType === 'porcentaje') {
    descuentoAplicado = subtotal * (discountValue / 100);
  }

  // Asegurar que el descuento no sea mayor al subtotal
  if (descuentoAplicado > subtotal) descuentoAplicado = subtotal;

  // Calcular subtotal con cupón aplicado (solo para el total)
  let subtotalConDescuento = subtotal - descuentoAplicado;

  // Calcular envío
  const envio = subtotalConDescuento < 500 && subtotalConDescuento > 0 ? 299.00 : 0.00;
  document.getElementById('shipping-cost').textContent = envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`;

  // Calcular total final
  const totalFinal = subtotalConDescuento + envio;
  document.getElementById('total-price').textContent = `$${totalFinal.toFixed(2)}`;

  // Mostrar resumen del cupón
  actualizarCuponAplicado();
}


// Cupones

document.getElementById('apply-coupon-btn').addEventListener('click', () => {
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
    messageEl.className = 'text-danger mt-2';
    return;
  }

  messageEl.textContent = 'Cupón aplicado correctamente!';

  messageEl.className = 'text-success mt-2';


  descuentoFijoGlobal = descuentoFijo;
  descuentoPorcentajeGlobal = descuentoPorcentaje;
  
  
  guardarCupones(code, descuentoFijo, descuentoPorcentaje);

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  actualizarResumenCompra(cartItems);
  
  console.log('🎫 Cupón aplicado:', code, {descuentoFijo, descuentoPorcentaje});
});


document.addEventListener('DOMContentLoaded', function() {

  const couponContainer = document.getElementById('apply-coupon-btn').parentElement;
  if (!document.getElementById('remove-coupon-btn')) {
    const removeBtn = document.createElement('button');
    removeBtn.id = 'remove-coupon-btn';
    removeBtn.className = 'btn btn-outline-danger btn-sm ms-2';
    removeBtn.textContent = 'Quitar cupón';
    removeBtn.style.display = 'none';
    
    removeBtn.addEventListener('click', () => {
      limpiarCupones();
      removeBtn.style.display = 'none';
    });
    
    couponContainer.appendChild(removeBtn);
  }
  

  const cuponesGuardados = JSON.parse(localStorage.getItem('appliedCoupons') || '{}');
  if (cuponesGuardados.codigoCupon) {
    document.getElementById('remove-coupon-btn').style.display = 'inline-block';
  }

  localStorage.setItem('discountCode', code);
  localStorage.setItem('discountValue', descuento);
  localStorage.setItem('discountType', tipoDescuento);
  input.value = '';

  renderCartItems();
});

function actualizarCuponAplicado() {
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
      renderCartItems();
    });

    const discountElement = document.getElementById('code-coupon');
    const discountValue = document.getElementById('discount-coupon');

    const descuentoCarrito = obtenerSubtotal(JSON.parse(localStorage.getItem('cart')) || []);

    discountElement.innerHTML = `Cupón: <strong>${discountCode}</strong>`;
    if (localStorage.getItem('discountType') == 'fijo') {
      discountValue.innerHTML = formatCurrency(parseFloat(localStorage.getItem('discountValue')));
    } else {
      const porcentaje = parseFloat(localStorage.getItem('discountValue'));
      const montoDescuento = (porcentaje / 100) * descuentoCarrito;

      discountValue.innerHTML = `<strong>-${porcentaje}% </strong>(${formatCurrency(montoDescuento)})`;

    }
  }
}


function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

document.getElementById('button-to-pay').addEventListener('click', function (event) {
  // Optionally prevent default navigation
  // event.preventDefault();

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

});
