// payment/payment.js
import { loadCartCount } from "../functions/loadCartCount.js";
import { getCurrentItem } from "../product-detail/getCurrentItem.js";

export class PaymentManager {
    constructor() {
        console.log('🚀 PaymentManager iniciando...');
        this.cart = []; // Inicializamos vacío
        this.shippingCost = 299;
        this.freeShippingThreshold = 500;
        this.appliedCoupons = {}; // Inicializamos vacío
    }

    getAppliedCoupons() {
        try {
            const coupons = localStorage.getItem('appliedCoupons');
            console.log('🎫 Cupones raw del localStorage:', coupons);
            return coupons ? JSON.parse(coupons) : {};
        } catch (error) {
            console.error('❌ Error al obtener cupones:', error);
            return {};
        }
    }

    async getCartFromStorage() {
        try {
            const cartRaw = localStorage.getItem('cart');
            const cartArray = cartRaw ? JSON.parse(cartRaw) : [];
            const cartItems = await getCartItemsArray(cartArray);
            return Array.isArray(cartItems) ? cartItems : [];
        } catch (error) {
            console.error('❌ Error al obtener carrito:', error);
            return [];
        }
    }

    getImageUrl(item) {
        let imageUrl = item.image || null;
        return !imageUrl ? 'assets/logotipo-clicknsweet-2.png' : `data:image/jpeg;base64,${imageUrl}`;
    }

    calculateDeliveryDate() {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 7);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return deliveryDate.toLocaleDateString('es-ES', options);
    }

    renderDeliveryDate() {
        console.log('📅 Intentando renderizar fecha de entrega...');
        const deliveryDate = this.calculateDeliveryDate();
        const titleElement = document.querySelector('.payment-title');
        if (titleElement) {
            titleElement.textContent = `Llega el ${deliveryDate}`;
            console.log('✅ Fecha de entrega actualizada');
        } else {
            console.warn('⚠️ No se encontró .payment-title');
        }
    }

    async renderCartProducts() {
        console.log('🛒 Intentando renderizar productos...');
        let productsContainer = document.querySelectorAll('.section-box')[1];
        if (!productsContainer) {
            const cartTitle = Array.from(document.querySelectorAll('.payment-title'))
                .find(title => title.textContent.includes('Carrito'));
            if (cartTitle) productsContainer = cartTitle.nextElementSibling;
        }
        if (!productsContainer) return console.error('❌ No se encontró el contenedor de productos');

        productsContainer.innerHTML = '';
        if (this.cart.length === 0) {
            productsContainer.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">No hay productos en el carrito</p>
                    <a href="products.html" class="btn btn-pink">Ver productos</a>
                </div>
            `;
            return;
        }

        this.cart.forEach((item, index) => {
            const productElement = this.createProductElement(item);
            productsContainer.appendChild(productElement);
        });
    }

    createProductElement(item) {
        const productDiv = document.createElement('div');
        productDiv.className = 'card-producto';
        const price = parseFloat(item.price_discount) || parseFloat(item.pricing) || parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const totalItemPrice = price * quantity;
        const imageSrc = this.getImageUrl(item);

        productDiv.innerHTML = `
            <img src="${imageSrc}" alt="${item.productName}" 
                 style="width:80px;height:80px;object-fit:cover;border-radius:8px;" />
            <div class="product-info">
                <strong>${item.productName}</strong><br/>
                <span class="text-muted">${item.description || 'Delicioso dulce artesanal'}</span>
                <div class="product-details mt-2">
                    <span class="quantity">Cantidad: ${quantity}</span>
                    <span class="price ms-3">$${totalItemPrice.toFixed(2)}</span>
                </div>
            </div>
        `;
        return productDiv;
    }

    calculateTotals() {
        let subtotal = 0;
        this.cart.forEach(item => {
            const price = parseFloat(item.price_discount) || parseFloat(item.pricing) || parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            subtotal += price * quantity;
        });

        let subtotalConDescuento = subtotal;
        let descuentoAplicado = 0;

        if (this.appliedCoupons.descuentoPorcentaje > 0) {
            descuentoAplicado = subtotalConDescuento * (this.appliedCoupons.descuentoPorcentaje / 100);
            subtotalConDescuento -= descuentoAplicado;
        } else if (this.appliedCoupons.descuentoFijo > 0) {
            descuentoAplicado = Math.min(this.appliedCoupons.descuentoFijo, subtotalConDescuento);
            subtotalConDescuento -= descuentoAplicado;
        }

        if (subtotalConDescuento < 0) subtotalConDescuento = 0;
        const shipping = subtotalConDescuento >= this.freeShippingThreshold || subtotalConDescuento === 0 ? 0 : this.shippingCost;
        const total = subtotalConDescuento + shipping;

        return {
            subtotalOriginal: subtotal,
            subtotal: subtotalConDescuento,
            shipping,
            total,
            descuentoAplicado,
            isShippingFree: shipping === 0,
            codigoCupon: this.appliedCoupons.codigoCupon || null
        };
    }

    async calculateAndRenderTotals() {
        const totals = this.calculateTotals();
        const resumenContainer = document.querySelector('.resumen-precios');
        if (!resumenContainer) return;

        const priceElements = resumenContainer.querySelectorAll('.d-flex span:last-child');
        if (priceElements[0]) priceElements[0].textContent = `${totals.subtotal.toFixed(2)}`;
        if (priceElements[1]) priceElements[1].innerHTML = totals.isShippingFree ? '<span class="text-success">GRATIS</span>' : `${totals.shipping.toFixed(2)}`;
        const totalSpan = resumenContainer.querySelector('.total span:last-child');
        if (totalSpan) totalSpan.textContent = `${totals.total.toFixed(2)}`;

        if (totals.descuentoAplicado > 0) await this.addCouponDiscountInfo(resumenContainer, totals);
        if (totals.isShippingFree && totals.subtotal > 0) await this.addFreeShippingMessage(resumenContainer);
    }

    async addCouponDiscountInfo(container, totals) {
        const existing = container.querySelector('.coupon-discount-info');
        if (existing) existing.remove();
        const discountInfo = document.createElement('div');
        discountInfo.className = 'coupon-discount-info d-flex justify-content-between border-top pt-2 mt-2';
        discountInfo.innerHTML = `
            <span><i class="bi bi-ticket-perforated text-success me-2"></i>Descuento cupón (${totals.codigoCupon})</span>
            <span class="text-success">-${totals.descuentoAplicado.toFixed(2)}</span>
        `;
        const totalElement = container.querySelector('.total');
        totalElement.parentNode.insertBefore(discountInfo, totalElement);
    }

    async addFreeShippingMessage(container) {
        const existing = container.querySelector('.free-shipping-message');
        if (existing) return;
        const message = document.createElement('div');
        message.className = 'free-shipping-message alert alert-success mt-2';
        message.innerHTML = `<i class="bi bi-truck"></i> ¡Felicidades! Tu envío es gratis`;
        const button = container.querySelector('.btn-pago');
        button.parentNode.insertBefore(message, button);
    }

    async setupPaymentButton() {
        const payButton = document.querySelector('.btn-pago');
        if (!payButton) return;
        payButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    async processPayment() {
        if (!this.cart) return alert('No hay productos en el carrito');
        const selectedCard = document.querySelector('input[name="tarjeta"]:checked');
        if (!selectedCard) return alert('Por favor selecciona un método de pago');

        const totals = this.calculateTotals();
        const orderData = {
            id: await this.generateOrderId(),
            date: new Date().toISOString(),
            deliveryDate: this.calculateDeliveryDate(),
            products: [...this.cart],
            subtotalOriginal: totals.subtotalOriginal,
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            total: totals.total,
            discountAmount: totals.descuentoAplicado,
            couponUsed: totals.codigoCupon,
            paymentMethod: selectedCard.id,
            status: 'processing'
        };

        await this.saveOrder(orderData);
        await this.clearCart();
        await this.showOrderConfirmation(orderData);
    }

    async generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    async saveOrder(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
        } catch (err) {
            console.error('❌ Error al guardar pedido:', err);
        }
    }

    async clearCart() {
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedCoupons');
        this.cart = [];
        this.appliedCoupons = {};
    }

    async updateCustomerInfo(customerData) {
        const customerInfoElement = document.querySelector('.section-box p');
        if (!customerInfoElement || !customerData) return;
        customerInfoElement.innerHTML = `<strong>Enviar a ${customerData.name}</strong><br/><span class="text-muted">${customerData.address}</span>`;
    }

    async init() {
        const isPaymentPage = document.querySelector('.payment-page') || document.querySelector('.resumen-precios') || window.location.pathname.includes('payment');
        if (!isPaymentPage) return;

        // Cargar datos
        this.cart = await this.getCartFromStorage();
        this.appliedCoupons = this.getAppliedCoupons();

        this.renderDeliveryDate();
        await this.renderCartProducts();
        await this.calculateAndRenderTotals();
        await this.setupPaymentButton();

        const customerData = {
            name: "Juan Pérez",
            address: "Calle Reforma 123, Col. Centro, Ciudad de México, CDMX, CP 06000"
        };
        await this.updateCustomerInfo(customerData);
    }
}

// Funciones de inicialización
export async function initPaymentPage() {
    const paymentManager = new PaymentManager();
    await paymentManager.init();
}

// Datos de prueba
export function addTestData() {
    const testCart = [
        { id: 1, name: "Cargando...", description: "Cargando...", price: 0.00, quantity: 0, picture: "assets/Dulces-Enchilados.jpg" },
    ];
    localStorage.setItem('cart', JSON.stringify(testCart));
    window.location.reload();
}

// Obtener items completos
async function getCartItemsArray(items) {
    const cartItemsArray = [];
    for (const element of items) {
        const data = await getCurrentItem(element.id);
        if (!data) continue;
        data.quantity = element.quantity;
        cartItemsArray.push(data);
    }
    return cartItemsArray;
}


document.addEventListener("DOMContentLoaded", () => {
    const paymentBtn = document.getElementById("paymentToDo");
    if (!paymentBtn) return;

    // Revisar si hay usuario en localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isLoggedIn = !!user.id;

    // Cambiar texto del botón
    paymentBtn.textContent = isLoggedIn ? "Realiza tu pedido y paga" : "Inicia sesión para continuar";

    // Función de click según estado
    paymentBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            // Usuario no logueado
            console.log("🔑 Usuario no logueado: mostrar modal de login/registro");
            showLoginOrRegister(); // crea esta función para mostrar login/register
        } else {
            // Usuario logueado
            console.log("💳 Usuario logueado: procesar pedido");
            processUserOrder(); // crea esta función para iniciar el flujo de pago
        }
    });
});

// Función para mostrar modal de login/registro
function showLoginOrRegister() {
    window.location.href="../login/index.html"
}

// Función para procesar pedido
function processUserOrder() {
    // Aquí podrías llamar a tu PaymentManager o la función de pago
    console.log("Iniciando flujo de pago...");
    // Por ejemplo:
    // initPaymentPage();
}
