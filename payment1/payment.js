// payment/payment.js -
import { loadCartCount } from "../functions/loadCartCount.js";

export class PaymentManager {
  constructor() {
    console.log("🚀 PaymentManager iniciando...");
    this.cart = this.getCartFromStorage();
    console.log("🛒 Carrito cargado:", this.cart);
    this.shippingCost = 299;
    this.freeShippingThreshold = 500;

    // NUEVO: Cargar cupones aplicados
    this.appliedCoupons = this.getAppliedCoupons();
    console.log("🎫 Cupones aplicados:", this.appliedCoupons);
  }

  // NUEVA FUNCIÓN: Obtener cupones aplicados del localStorage
  getAppliedCoupons() {
    try {
      const coupons = localStorage.getItem("appliedCoupons");
      console.log("🎫 Cupones raw del localStorage:", coupons);
      return coupons ? JSON.parse(coupons) : {};
    } catch (error) {
      console.error("❌ Error al obtener cupones:", error);
      return {};
    }
  }

  getCartFromStorage() {
    try {
      const cart = localStorage.getItem("cart");
      console.log("📦 Datos del carrito en localStorage:", cart);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("❌ Error al obtener carrito:", error);
      return [];
    }
  }

  getImageUrl(item) {
    let imageUrl = item.picture || item.image || item.img || null;

    if (!imageUrl) {
      console.log(`⚠️ No se encontró imagen para ${item.name}`);
      return "assets/logotipo-clicknsweet-2.png"; // Imagen por defecto
    }

    if (
      imageUrl.startsWith("http") ||
      imageUrl.startsWith("/") ||
      imageUrl.startsWith("./")
    ) {
      console.log(`🖼️ Usando ruta completa: ${imageUrl}`);
      return imageUrl;
    }

    if (!imageUrl.startsWith("assets/")) {
      imageUrl = `assets/${imageUrl}`;
    }

    console.log(`🖼️ URL de imagen procesada para ${item.name}: ${imageUrl}`);
    return imageUrl;
  }

  calculateDeliveryDate() {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const formattedDate = deliveryDate.toLocaleDateString("es-ES", options);
    console.log("📅 Fecha de entrega calculada:", formattedDate);
    return formattedDate;
  }

  renderDeliveryDate() {
    console.log("📅 Intentando renderizar fecha de entrega...");
    const deliveryDate = this.calculateDeliveryDate();
    const titleElement = document.querySelector(".payment-title");
    console.log("📅 Elemento title encontrado:", titleElement);

    if (titleElement) {
      titleElement.textContent = `Llega el ${deliveryDate}`;
      console.log("✅ Fecha de entrega actualizada");
    } else {
      console.error("❌ No se encontró .payment-title");
    }
  }

  renderCartProducts() {
    console.log("🛒 Intentando renderizar productos...");

    let productsContainer = document.querySelectorAll(".section-box")[1];
    if (!productsContainer) {
      console.log("🔍 Intentando encontrar contenedor por otro método...");

      const cartTitle = Array.from(
        document.querySelectorAll(".payment-title")
      ).find((title) => title.textContent.includes("Carrito"));
      if (cartTitle) {
        productsContainer = cartTitle.nextElementSibling;
      }
    }

    console.log("📦 Contenedor de productos encontrado:", productsContainer);

    if (!productsContainer) {
      console.error("❌ No se encontró el contenedor de productos");
      return;
    }

    productsContainer.innerHTML = "";

    if (this.cart.length === 0) {
      console.log("🛒 Carrito vacío, mostrando mensaje...");
      productsContainer.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">No hay productos en el carrito</p>
                    <a href="products.html" class="btn btn-pink">Ver productos</a>
                </div>
            `;
      return;
    }

    console.log(`🛒 Renderizando ${this.cart.length} productos...`);

    this.cart.forEach((item, index) => {
      console.log(`📦 Renderizando producto ${index + 1}:`, item);
      const productElement = this.createProductElement(item);
      productsContainer.appendChild(productElement);
    });

    console.log("✅ Productos renderizados exitosamente");
  }

  createProductElement(item) {
    const productDiv = document.createElement("div");
    productDiv.className = "card-producto";

    const price =
      parseFloat(item.price_discount) ||
      parseFloat(item.pricing) ||
      parseFloat(item.price) ||
      0;
    const quantity = parseInt(item.quantity) || 1;
    const totalItemPrice = price * quantity;

    const imageSrc = this.getImageUrl(item);

    console.log(`📦 Producto: ${item.name}`);
    console.log(`🖼️ Imagen: ${imageSrc}`);
    console.log(
      `💰 Precio: ${price}, Cantidad: ${quantity}, Total: ${totalItemPrice}`
    );

    productDiv.innerHTML = `
            <img src="${imageSrc}" 
                 alt="${item.name}" 
                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"
                 onerror="console.error('Error cargando imagen:', this.src); this.src='assets/logotipo-clicknsweet-2.png'" 
                 onload="console.log('✅ Imagen cargada correctamente:', this.src)" />
            <div class="product-info">
                <strong>${item.name}</strong><br />
                <span class="text-muted">${
                  item.description || "Delicioso dulce artesanal"
                }</span>
                <div class="product-details mt-2">
                    <span class="quantity">Cantidad: ${quantity}</span>
                    <span class="price ms-3">$${totalItemPrice.toFixed(
                      2
                    )}</span>
                </div>
            </div>
        `;

    return productDiv;
  }

  calculateTotals() {
    let subtotal = 0;

    this.cart.forEach((item) => {
      const price =
        parseFloat(item.price_discount) ||
        parseFloat(item.pricing) ||
        parseFloat(item.price) ||
        0;
      const quantity = parseInt(item.quantity) || 1;
      const itemTotal = price * quantity;
      subtotal += itemTotal;

      console.log(
        `💰 Item: ${item.name} - Precio: ${price} x ${quantity} = ${itemTotal}`
      );
    });

    console.log(`💰 Subtotal original: ${subtotal}`);

    // Aplicar descuentos de cupones
    let subtotalConDescuento = subtotal;
    let descuentoAplicado = 0;

    if (this.appliedCoupons.descuentoPorcentaje > 0) {
      descuentoAplicado =
        subtotalConDescuento * (this.appliedCoupons.descuentoPorcentaje / 100);
      subtotalConDescuento =
        subtotalConDescuento *
        (1 - this.appliedCoupons.descuentoPorcentaje / 100);
      console.log(
        `🎫 Aplicando descuento porcentual: ${
          this.appliedCoupons.descuentoPorcentaje
        }% = -${descuentoAplicado.toFixed(2)}`
      );
    } else if (this.appliedCoupons.descuentoFijo > 0) {
      descuentoAplicado = Math.min(
        this.appliedCoupons.descuentoFijo,
        subtotalConDescuento
      );
      subtotalConDescuento =
        subtotalConDescuento - this.appliedCoupons.descuentoFijo;
      console.log(
        `🎫 Aplicando descuento fijo: -${
          this.appliedCoupons.descuentoFijo
        } = -${descuentoAplicado.toFixed(2)}`
      );
    }

    if (subtotalConDescuento < 0) subtotalConDescuento = 0;

    console.log(`💰 Subtotal con descuento: ${subtotalConDescuento}`);

    const shipping =
      subtotalConDescuento >= this.freeShippingThreshold ||
      subtotalConDescuento === 0
        ? 0
        : this.shippingCost;
    const total = subtotalConDescuento + shipping;

    const totals = {
      subtotalOriginal: subtotal,
      subtotal: subtotalConDescuento,
      shipping: shipping,
      total: total,
      descuentoAplicado: descuentoAplicado,
      isShippingFree: shipping === 0,
      codigoCupon: this.appliedCoupons.codigoCupon || null,
    };

    console.log("💰 Totales calculados:", totals);
    return totals;
  }

  //  Renderizar totales con cupones
  calculateAndRenderTotals() {
    console.log("💰 Intentando renderizar totales...");
    const totals = this.calculateTotals();
    const resumenContainer = document.querySelector(".resumen-precios");
    console.log("💰 Contenedor de resumen encontrado:", resumenContainer);

    if (!resumenContainer) {
      console.error("❌ No se encontró .resumen-precios");
      return;
    }

    const priceElements = resumenContainer.querySelectorAll(
      ".d-flex span:last-child"
    );
    console.log("💰 Elementos de precio encontrados:", priceElements.length);

    if (priceElements[0]) {
      priceElements[0].textContent = `${totals.subtotal.toFixed(2)}`;
      console.log("✅ Subtotal actualizado");
    }

    if (priceElements[1]) {
      priceElements[1].innerHTML = totals.isShippingFree
        ? '<span class="text-success">GRATIS</span>'
        : `${totals.shipping.toFixed(2)}`;
      console.log("✅ Envío actualizado");
    }

    const totalSpan = resumenContainer.querySelector(".total span:last-child");
    if (totalSpan) {
      totalSpan.textContent = `${totals.total.toFixed(2)}`;
      console.log("✅ Total actualizado");
    }

    if (totals.descuentoAplicado > 0) {
      this.addCouponDiscountInfo(resumenContainer, totals);
    }

    if (totals.isShippingFree && totals.subtotal > 0) {
      this.addFreeShippingMessage(resumenContainer);
    }
  }

  addCouponDiscountInfo(container, totals) {
    const existingDiscount = container.querySelector(".coupon-discount-info");
    if (existingDiscount) {
      existingDiscount.remove();
    }

    const discountInfo = document.createElement("div");
    discountInfo.className =
      "coupon-discount-info d-flex justify-content-between border-top pt-2 mt-2";
    discountInfo.innerHTML = `
            <span>
                <i class="bi bi-ticket-perforated text-success me-2"></i>
                Descuento cupón (${totals.codigoCupon})
            </span>
            <span class="text-success">-${totals.descuentoAplicado.toFixed(
              2
            )}</span>
        `;

    const totalElement = container.querySelector(".total");
    totalElement.parentNode.insertBefore(discountInfo, totalElement);

    console.log("✅ Información de descuento agregada");
  }

  addFreeShippingMessage(container) {
    const existingMessage = container.querySelector(".free-shipping-message");
    if (existingMessage) return;

    const message = document.createElement("div");
    message.className = "free-shipping-message alert alert-success mt-2";
    message.innerHTML = `
            <i class="bi bi-truck"></i> 
            ¡Felicidades! Tu envío es gratis
        `;

    const button = container.querySelector(".btn-pago");
    button.parentNode.insertBefore(message, button);
  }

  //  botón de pago
  setupPaymentButton() {
    console.log("🔘 Configurando botón de pago...");
    const payButton = document.querySelector(".btn-pago");
    console.log("🔘 Botón de pago encontrado:", payButton);

    if (!payButton) {
      console.error("❌ No se encontró .btn-pago");
      return;
    }

    payButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("🔘 Botón de pago clickeado");
      this.processPayment();
    });

    console.log("✅ Botón de pago configurado");
  }

  processPayment() {
    console.log("💳 Procesando pago...");

    if (this.cart.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    const selectedCard = document.querySelector(
      'input[name="tarjeta"]:checked'
    );
    if (!selectedCard) {
      alert("Por favor selecciona un método de pago");
      return;
    }

    const totals = this.calculateTotals();

    //  objeto de pedido
    const orderData = {
      id: this.generateOrderId(),
      fecha: new Date().toLocaleDateString("es-ES"), // fecha legible para mostrar
      deliveryDate: this.calculateDeliveryDate(),
      productos: this.cart.map((item) => ({
        nombre: item.name,
        cantidad: item.quantity,
        precio:
          parseFloat(item.price_discount || item.pricing || item.price) || 0,
        imagen: this.getImageUrl(item), // <-- agregamos la URL aquí
      })),
      subtotalOriginal: totals.subtotalOriginal,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      discountAmount: totals.descuentoAplicado,
      couponUsed: totals.codigoCupon,
      paymentMethod: selectedCard.id,
      estado: "processing",
    };

    console.log("📋 Datos del pedido:", orderData);

    // Guardar pedido
    this.saveOrderForUser(orderData);

    // Limpiar carrito
    this.clearCart();

    // Actualizar contador del carrito en navbar
    loadCartCount();

    // Mostrar confirmación
    this.showOrderConfirmation(orderData);
  }

  // Generar ID único para el pedido
  generateOrderId() {
    return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  // Dentro de tu clase PaymentManager, agrega este método:

  saveOrderForUser(orderData) {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.email) {
        alert("No hay usuario autenticado. No se puede guardar el pedido.");
        return;
      }

      const storageKey = `pedidos_${currentUser.email}`;

      // Obtener pedidos actuales del usuario
      let userOrders = JSON.parse(localStorage.getItem(storageKey)) || [];

      // Agregar el nuevo pedido
      userOrders.push(orderData);

      // Guardar de nuevo en localStorage
      localStorage.setItem(storageKey, JSON.stringify(userOrders));

      console.log("✅ Pedido guardado para el usuario:", currentUser.email);
    } catch (error) {
      console.error("❌ Error al guardar pedido para el usuario:", error);
    }
  }

  // Guardar pedido en localStorage
  //   saveOrder(orderData) {
  //     try {
  //       const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //       if (!currentUser || !currentUser.id) {
  //         alert("No hay usuario autenticado. No se puede guardar el pedido.");
  //         return;
  //       }

  //       // Adjuntar ID del usuario al pedido
  //       orderData.userId = currentUser.id;

  //       let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  //       orders.push(orderData);
  //       localStorage.setItem("orders", JSON.stringify(orders));
  //       console.log("✅ Pedido guardado para el usuario:", currentUser.id);
  //     } catch (error) {
  //       console.error("❌ Error al guardar pedido:", error);
  //     }
  //   }

  clearCart() {
    localStorage.removeItem("cart");
    localStorage.removeItem("appliedCoupons");
    this.cart = [];
    this.appliedCoupons = {};
    console.log("🗑️ Carrito y cupones limpiados");
  }

  showOrderConfirmation(orderData) {
    console.log("🎉 Mostrando confirmación de pedido...");

    //  modal  HTML
    const modal = document.getElementById("orderConfirmationModal");
    if (!modal) {
      console.error("❌ No se encontró el modal en el HTML");
      return;
    }

    const orderIdElement = modal.querySelector("#modal-order-id");
    const totalElement = modal.querySelector("#modal-total");
    const deliveryDateElement = modal.querySelector("#modal-delivery-date");

    if (orderIdElement) orderIdElement.textContent = orderData.id;
    if (totalElement)
      totalElement.textContent = `${orderData.total.toFixed(2)}`;
    if (deliveryDateElement)
      deliveryDateElement.textContent = orderData.deliveryDate;

    //  modal de Bootstrap
    const modalInstance = new bootstrap.Modal(modal);

    const continueShoppingBtn = modal.querySelector("#continueShoppingBtn");
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener("click", () => {
        modalInstance.hide();
        setTimeout(() => {
          window.location.href = "index.html";
        }, 300);
      });
    }

    modal.addEventListener("hidden.bs.modal", () => {
      setTimeout(() => {
        window.location.href = "index.html";
      }, 300);
    });

    modalInstance.show();

    console.log("✅ Modal de confirmación mostrado");
  }

  updateCustomerInfo(customerData) {
    console.log("👤 Actualizando información del cliente...");
    const customerInfoElement = document.querySelector(".section-box p");
    console.log("👤 Elemento de info del cliente:", customerInfoElement);

    if (customerInfoElement && customerData) {
      customerInfoElement.innerHTML = `
                <strong>Enviar a ${customerData.name}</strong><br />
                <span class="text-muted">${customerData.address}</span>
            `;
      console.log("✅ Información del cliente actualizada");
    }
  }

  init() {
    console.log("🎯 Iniciando PaymentManager...");

    // Verificar que estamos en la página correcta
    const isPaymentPage =
      document.querySelector(".payment-page") ||
      document.querySelector(".resumen-precios") ||
      window.location.pathname.includes("payment");

    console.log("🔍 ¿Es página de pago?", isPaymentPage);

    if (!isPaymentPage) {
      console.log(
        "⚠️ No parece ser la página de pago, saltando inicialización"
      );
      return;
    }

    this.renderDeliveryDate();
    this.renderCartProducts();
    this.calculateAndRenderTotals();
    this.setupPaymentButton();

    const customerData = {
      name: "Juan Pérez",
      address:
        "Calle Reforma 123, Col. Centro, Ciudad de México, CDMX, CP 06000",
    };
    this.updateCustomerInfo(customerData);

    console.log("🎉 PaymentManager inicializado completamente");
  }
}

export function initPaymentPage() {
  console.log("🚀 initPaymentPage llamada");
  const paymentManager = new PaymentManager();
  paymentManager.init();
}

export function addTestData() {
  const testCart = [
    {
      id: 1,
      name: "Dulces Enchilados",
      description: "Deliciosos dulces con chile",
      price: 25.5,
      quantity: 2,
      picture: "assets/Dulces-Enchilados.jpg",
    },
    {
      id: 2,
      name: "Paletas exóticas",
      description: "Paletas de sabores únicos",
      price: 15.0,
      quantity: 3,
      picture: "assets/paleta-animal.jpg",
    },
  ];

  localStorage.setItem("cart", JSON.stringify(testCart));
  console.log("🧪 Datos de prueba agregados al carrito");
  window.location.reload();
}

window.debugCart = function () {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  console.log("🛒 Carrito actual:", cart);

  cart.forEach((item, index) => {
    console.log(`📦 Producto ${index + 1}:`);
    console.log(`   - Nombre: ${item.name}`);
    console.log(
      `   - Precio original: ${item.pricing} (tipo: ${typeof item.pricing})`
    );
    console.log(
      `   - Precio con descuento: ${
        item.price_discount
      } (tipo: ${typeof item.price_discount})`
    );
    console.log(
      `   - Cantidad: ${item.quantity} (tipo: ${typeof item.quantity})`
    );
    console.log(`   - Imagen (picture): ${item.picture}`);
    console.log(`   - Imagen (image): ${item.image}`);
    console.log(`   - Imagen (img): ${item.img}`);
  });

  return cart;
};

window.checkImages = function () {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart.forEach((item, index) => {
    const img = new Image();
    const imageUrl =
      item.picture ||
      item.image ||
      item.img ||
      "assets/logotipo-clicknsweet-2.png";

    img.onload = function () {
      console.log(`✅ Imagen ${index + 1} existe: ${imageUrl}`);
    };

    img.onerror = function () {
      console.error(`❌ Imagen ${index + 1} NO existe: ${imageUrl}`);
    };

    img.src = imageUrl;
  });
};
