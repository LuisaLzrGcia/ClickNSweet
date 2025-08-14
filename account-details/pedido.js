import fetchData from "../fetchData/fetchData.js";
import { getLoggedUserEmail } from "./session-temp.js";

export async function initPedido() {
  const id = getLoggedUserEmail();
  if (!id) return;

  try {
    // Obtener usuario
    const user = await fetchData(`/user/${id}`, "GET");
    if (!user || !user.id) return;

    // Obtener pedidos
    const pedidos = await fetchData(`/orders/user/${user.id}`, "GET");
    const contenedor = document.getElementById("pedidos");
    contenedor.innerHTML = `
      <h3 class="titulo-seccion mb-4">Mis pedidos</h3>
    `;

    if (!pedidos || pedidos.length === 0) {
      contenedor.innerHTML += `
        <div class="alert alert-info">No has realizado ningún pedido aún.</div>
      `;
      return;
    }

    // Modal único
    if (!document.getElementById("detallePedidoModal")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="modal fade" id="detallePedidoModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content bg-white text-dark">
              <div class="modal-header border-secondary">
                <h5 class="modal-title">Detalle del Pedido</h5>
                <button type="button" class="btn-close btn-close-dark" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body" id="modal-pedido-body"></div>
              <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-rosewood" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      `
      );
    }

    const modalBody = document.getElementById("modal-pedido-body");

    // Mostrar pedidos (más recientes primero)
    pedidos.reverse().forEach((pedido) => {
      const fecha = new Date(pedido.createdAt).toLocaleDateString();

      const pedidoCard = document.createElement("div");
      pedidoCard.className =
        "card bg-white border-secondary text-dark mb-4 shadow-sm";

      pedidoCard.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center border-secondary">
          <div>
            <strong>Pedido #${pedido.id}</strong><br>
            <small class="text-muted">Fecha: ${fecha}</small>
          </div>
          <span class="badge bg-pink fs-6">${pedido.status}</span>
        </div>
        <div class="card-body p-3">
          ${pedido.orderLines
            .map(
              (line) => `
              <div class="d-flex align-items-center mb-3">
                <img src="${
                  line.product?.image || "https://via.placeholder.com/60"
                }"
                     alt="${line.product?.name || "Producto"}"
                     class="rounded border border-secondary me-3"
                     style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                  <strong>${line.product?.name || "Desconocido"}</strong><br>
                  <small class="text-muted">$${line.price} x ${
                line.quantity
              }</small>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
        <div class="card-footer border-secondary text-end">
          <button class="btn btn-pink btn-sm ver-detalle-btn">Ver detalle</button>
        </div>
      `;

      // Evento para mostrar modal con detalle completo
      pedidoCard
        .querySelector(".ver-detalle-btn")
        .addEventListener("click", () => {
          let modalContent = `
          <p><strong>Pedido #${pedido.id}</strong></p>
          <p>Dirección: ${pedido.shippingAddress || "N/A"}</p>
          <p><strong>Cliente:</strong> ${user.name || user.email}</p>
          <p><strong>Estado:</strong> ${pedido.status}</p>
          <p><strong>Envío:</strong> ${
            pedido.shippingCarrier || "N/A"
          } - Tracking: ${pedido.trackingNumber || "N/A"}</p>
          <p><strong>Total:</strong> $${pedido.totalAmount}</p>
          <hr>
          <h6 class="mb-3">Productos</h6>
          ${pedido.orderLines
            .map(
              (line) => `
              <div class="d-flex align-items-center mb-3">
                <img src="${
                  line.product?.image || "https://via.placeholder.com/50"
                }"
                     alt="${line.product?.name || "Producto"}"
                     class="rounded border border-secondary me-3"
                     style="width: 50px; height: 50px; object-fit: cover;">
                <div class="flex-grow-1">
                  <strong>${line.product?.name || "Desconocido"}</strong><br>
                  <small class="text-muted">Cantidad: ${line.quantity}</small>
                </div>
                <div>
                  <strong>$${line.price}</strong>
                </div>
              </div>
            `
            )
            .join("")}
        `;

          modalBody.innerHTML = modalContent;
          new bootstrap.Modal(
            document.getElementById("detallePedidoModal")
          ).show();
        });

      contenedor.appendChild(pedidoCard);
    });
  } catch (error) {
    console.error("Error cargando pedidos:", error);
  }
}
