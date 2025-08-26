// payment/payment.js
import { loadCartCount } from "../functions/loadCartCount.js";
import createOrder from "../payment/script.js";
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
                    <a href="/products/index.html" class="btn btn btn-pink-see">Ver productos</a>
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
        const price = item.discountValue > 0 ? item.discountValue : item.price
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
        let subtotalOriginal = 0;
        let subtotalConDescuento = 0;

        this.cart.forEach(item => {
            const quantity = parseInt(item.quantity) || 1;
            const price = item.price || 0;
            const discountPrice = item.discountValue > 0 ? item.discountValue : price;

            subtotalOriginal += price * quantity;
            subtotalConDescuento += discountPrice * quantity;
        });

        let descuentoAplicado = 0;

        if (this.appliedCoupons.descuentoPorcentaje > 0) {
            descuentoAplicado = subtotalConDescuento * (this.appliedCoupons.descuentoPorcentaje / 100);
            subtotalConDescuento -= descuentoAplicado;
        } else if (this.appliedCoupons.descuentoFijo > 0) {
            descuentoAplicado = Math.min(this.appliedCoupons.descuentoFijo, subtotalConDescuento);
            subtotalConDescuento -= descuentoAplicado;
        }

        if (subtotalConDescuento < 0) subtotalConDescuento = 0;

        const shipping = (subtotalConDescuento >= this.freeShippingThreshold || subtotalConDescuento === 0) ? 0 : this.shippingCost;
        const total = subtotalConDescuento + shipping;

        return {
            subtotalOriginal,
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
        if (!this.cart || this.cart.length === 0) {
            return alert('No hay productos en el carrito');
        }

        // Verificar método de pago seleccionado
        const selectedCard = document.querySelector('input[name="tarjeta"]:checked');
        if (!selectedCard) return alert('Por favor selecciona un método de pago');

        // Obtener id de la dirección seleccionada
        const select = document.getElementById("address-select");
        const selectedAddressId = parseInt(select.value);
        if (!selectedAddressId) return alert('Por favor selecciona una dirección de envío');

        const totals = this.calculateTotals();

        const orderData = {
            id: this.generateOrderId(),
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

        // Construir orderLines desde el carrito
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const orderLines = cart.map(item => ({
            quantity: item.quantity,
            product: { id: item.id }
        }));

        // Construir el body con el formato que espera el backend
        const body = {
            userId: Number(JSON.parse(localStorage.getItem("usuario")).id),
            shippingAddressId: selectedAddressId,
            status: "Pendiente",
            trackingNumber: generarTrackingNumber(), // función que genera un alfanumérico
            shippingCarrier: "DHL",
            orderLines: orderLines
        };

        console.log("Enviando pedido:", body);

        try {
            // Enviar la orden al backend
            const data = await createOrder(body);

            // Comprobar que se creó correctamente
            if (data) {
                // Ejecutar acciones posteriores
                await this.saveOrder(orderData);
                await this.clearCart();
                await this.showOrderConfirmation(orderData);
                console.log("🎉 Pedido creado con éxito:", orderData);
            } else {
                alert("Algo salió mal al crear el pedido.");
                console.error("Respuesta inesperada:", orderData);
            }
        } catch (error) {
            console.error("Error al crear el pedido:", error);
            alert("No se pudo crear el pedido. Intenta nuevamente.");
        }
    }


    showOrderConfirmation(orderData) {
        console.log('🎉 Mostrando confirmación de pedido...');

        //  modal  HTML
        const modal = document.getElementById('orderConfirmationModal');
        if (!modal) {
            console.error('❌ No se encontró el modal en el HTML');
            return;
        }


        const orderIdElement = modal.querySelector('#modal-order-id');
        const totalElement = modal.querySelector('#modal-total');
        const deliveryDateElement = modal.querySelector('#modal-delivery-date');

        if (orderIdElement) orderIdElement.textContent = orderData.id;
        if (totalElement) totalElement.textContent = `${orderData.total.toFixed(2)}`;
        if (deliveryDateElement) deliveryDateElement.textContent = orderData.deliveryDate;

        //  modal de Bootstrap
        const modalInstance = new bootstrap.Modal(modal);


        const continueShoppingBtn = modal.querySelector('#continueShoppingBtn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                modalInstance.hide();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 300);
            });
        }


        modal.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });


        modalInstance.show();

        console.log('✅ Modal de confirmación mostrado');
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
        customerInfoElement.innerHTML = `<strong>Enviar a ${customerData.name}</strong><br/>`;
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
            name: JSON.parse(localStorage.getItem("currentUser")).name
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

    setupPaymentButton()
})

function generarTrackingNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}