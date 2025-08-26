import fetchData from "../fetchData/fetchData.js";
import { getLoggedUserEmail } from "./session-temp.js";

export async function initPedido() {
  const userId = getLoggedUserEmail();
  if (!userId) return;

  try {
    // Obtener usuario
    const user = await fetchData(`/user/${userId}`, "GET");
    if (!user || !user.id) return;

    // Obtener pedidos
    const pedidos = await fetchData(`/orders/user/${user.id}`, "GET");
    const contenedor = document.getElementById("pedidos");
    contenedor.innerHTML = `<h3 class="titulo-seccion mb-4">Mis pedidos</h3>`;

    // Empty state con diseño claro
    if (!pedidos || pedidos.length === 0) {
      contenedor.innerHTML += `
        <div class="p-5 bg-white border-0 rounded-4 shadow-sm text-center">
          <div class="mb-2" style="font-size: 2rem;">🛍️</div>
          <h5 class="fw-semibold mb-1">Aún no tienes pedidos</h5>
          <p class="text-muted mb-0">Cuando realices una compra, verás el detalle aquí.</p>
        </div>
      `;
      return;
    }

    // --- Modal de detalle del pedido ---
    if (!document.getElementById("detallePedidoModal")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="modal fade" id="detallePedidoModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div class="modal-header" style="background:#e946c2;">
                <h5 class="modal-title text-white mb-0">Detalle del pedido!</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body p-0" id="modal-pedido-body"></div>
              <div class="modal-footer bg-light border-0">
                <button type="button" class="btn btn-rosewood px-4" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>`
      );
    }
    const modalBody = document.getElementById("modal-pedido-body");

    // --- Modal de comentario ---
    if (!document.getElementById("commentModal")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="modal fade" id="commentModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div class="modal-header" style="background:#e946c2;">
                <h5 class="modal-title text-white mb-0">Dejar comentario</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body p-4 bg-white text-dark">
                <div class="mb-3">
                  <label for="rating" class="form-label fw-semibold">Calificación</label>
                  <select id="rating" class="form-select">
                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐⭐</option>
                    <option value="3">3 ⭐⭐⭐</option>
                    <option value="4">4 ⭐⭐⭐⭐</option>
                    <option value="5" selected>5 ⭐⭐⭐⭐⭐</option>
                  </select>
                  <div id="starsPreview" class="mt-2 small" style="color:#f5c518;">⭐⭐⭐⭐⭐</div>
                </div>
                <div class="mb-0">
                  <label for="commentDetail" class="form-label fw-semibold">Comentario</label>
                  <textarea id="commentDetail" class="form-control" rows="4" placeholder="Cuéntanos qué te pareció el producto"></textarea>
                </div>
              </div>
              <div class="modal-footer bg-light border-0">
                <button type="button" class="btn btn-rosewood" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-pink2" id="submitComment">Enviar</button>
              </div>
            </div>
          </div>
        </div>`
      );
    }

    const commentModal = new bootstrap.Modal(
      document.getElementById("commentModal")
    );
    const submitCommentBtn = document.getElementById("submitComment");

    // Vista previa de estrellas (solo UI)
    const ratingSelect = document.getElementById("rating");
    const starsPreview = document.getElementById("starsPreview");
    if (ratingSelect && starsPreview) {
      const renderStars = (n) => {
        starsPreview.textContent = "★★★★★".slice(0, n).padEnd(5, "☆");
      };
      renderStars(parseInt(ratingSelect.value, 10));
      ratingSelect.addEventListener("change", (e) =>
        renderStars(parseInt(e.target.value, 10))
      );
    }

    // --- Mostrar pedidos ---
    pedidos.reverse().forEach((pedido) => {
      const fecha = new Date(pedido.createdAt).toLocaleDateString();

      const pedidoCard = document.createElement("div");
      pedidoCard.className =
        "card border-0 text-dark mb-4 shadow-sm rounded-4 overflow-hidden";

      pedidoCard.innerHTML = `
  <div class="p-3" style="background: linear-gradient(135deg, #8CF1FF, #E0F7FA);">
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <strong class="fs-5">Pedido #${pedido.id}</strong><br>
        <small class="text-muted">📅 ${fecha}</small>
      </div>
      <span class="badge bg-dark rounded-pill px-3 py-2">${pedido.status}</span>
    </div>
  </div>
  <div class="card-body p-3">
    ${pedido.orderLines
      .map((line, index) => {
        // Convertir BLOB a base64 si la imagen está presente
        // Suponiendo que 'line.product.image' es una cadena base64
        const imageUrl = line.product.image
          ? `data:image/jpeg;base64,${line.product.image}`
          : "../assets/default.jpg";

        return `
          <div class="d-flex align-items-center ${
            index < pedido.orderLines.length - 1
              ? "pb-3 mb-3 border-bottom"
              : ""
          }">
            <img
              src="${imageUrl}"
              alt="${line.product?.name || "Producto"}"
              class="rounded-3 border me-3"
              style="width:60px;height:60px;object-fit:cover;"
            >
            <div class="flex-grow-1">
              <div class="fw-semibold">${
                line.product?.name || "Desconocido"
              }</div>
              <div class="text-muted small">💲${line.price} × ${
          line.quantity
        }</div>
            </div>
          </div>
        `;
      })
      .join("")}
  </div>
  <div class="card-footer border-0 bg-transparent text-end pb-3">
    <button class="btn btn-pink btn-outline-dark btn-sm px-3 ver-detalle-btn">📦 Ver detalle</button>
  </div>
`;

      // Abrir modal de detalle
      pedidoCard
        .querySelector(".ver-detalle-btn")
        .addEventListener("click", () => {
          const modalContent = `
          <div class="p-4">
            <div class="row g-3 mb-2">
              <div class="col-12 col-md-6">
                <div class="p-3 bg-light rounded-3 border">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="text-muted small">Pedido</span>
                    <span class="badge bg-pink rounded-pill px-3 py-2">${
                      pedido.status
                    }</span>
                  </div>
                  <div class="fs-5 fw-semibold">#${pedido.id}</div>
                  <div class="text-muted small">Fecha: ${fecha}</div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="p-3 bg-light rounded-3 border">
                  <div class="mb-1"><strong>Total:</strong> $${
                    pedido.totalAmount
                  }</div>
                  <div><strong>Envío:</strong> ${
                    pedido.shippingCarrier || "N/A"
                  } <span class="text-muted">| Tracking: ${
            pedido.trackingNumber || "N/A"
          }</span></div>
                </div>
              </div>
              <div class="col-12">
                <div class="p-3 rounded-3 border">
                  <div class="row g-2">
                    <div class="col-md-6"><strong>Cliente:</strong> ${
                      user.firstName + " " + user.lastName
                    }</div>
                    <div class="col-md-6"><strong>Dirección de envio:</strong> ${
                      pedido.shippingAddress.address +
                      ", " +
                      pedido.shippingAddress.city +
                      ", " +
                      pedido.shippingAddress.country +
                      ", " +
                      pedido.shippingAddress.region
                    }</div>
                  </div>
                </div>
              </div>
            </div>

            <h6 class="fw-semibold mt-3 mb-2">Productos</h6>
            <ul class="list-group list-group-flush">
              ${pedido.orderLines
                .map(
                  (line) => `
                  <li class="list-group-item px-0">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <img
                          src="${
                            line.product?.image
                              ? `data:image/jpeg;base64,${line.product.image}`
                              : "../assets/default.jpg"
                          }"
                          alt="${line.product?.name || "Producto"}"
                          class="rounded-3 border me-3"
                          style="width:56px;height:56px;object-fit:cover;"
                        >
                        <div>
                          <div class="fw-semibold">${
                            line.product?.name || "Desconocido"
                          }</div>
                          <div class="text-muted small">Cantidad: ${
                            line.quantity
                          }</div>
                        </div>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold mb-1">$${line.price}</div>
                        <button class="btn btn-pink2 btn-sm px-3 comment-btn" data-product-id="${
                          line.product?.id
                        }">Dejar comentario</button>
                      </div>
                    </div>
                  </li>
                `
                )
                .join("")}
            </ul>
          </div>
        `;

          modalBody.innerHTML = modalContent;

          // Asociar evento de comentario por producto
          modalBody.querySelectorAll(".comment-btn").forEach((btn) => {
            const productId = btn.getAttribute("data-product-id");
            btn.onclick = () => {
              // Reset UI del modal de comentarios
              const detail = document.getElementById("commentDetail");
              const select = document.getElementById("rating");
              if (detail) detail.value = "";
              if (select) select.value = "5";
              if (starsPreview) starsPreview.textContent = "★★★★★";

              submitCommentBtn.onclick = async () => {
                const rating = parseInt(
                  document.getElementById("rating").value
                );
                const commentDetail = document
                  .getElementById("commentDetail")
                  .value.trim();
                if (!commentDetail)
                  return Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El comentario no puede estar vacío.",
                    confirmButtonColor: "#e946c2",
                    confirmButtonText: "Entendido",
                  });

                const commentJSON = {
                  user: { id: user.id },
                  product: { id: parseInt(productId) },
                  rating,
                  commentDetail,
                  commentDate: new Date().toISOString(),
                };

                try {
                  await fetchData("/comments", "POST", {}, commentJSON);
                  Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Comentario enviado correctamente.",
                    confirmButtonColor: "#e946c2",
                    confirmButtonText: "Entendido",
                  });
                  commentModal.hide();
                } catch (err) {
                  console.error(err);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al enviar el comentario.",
                    confirmButtonColor: "#e946c2",
                    confirmButtonText: "Entendido",
                  });
                }
              };
              commentModal.show();
            };
          });

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
