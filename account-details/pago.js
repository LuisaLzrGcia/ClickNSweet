import fetchData from "../fetchData/fetchData.js";
import { getLoggedUserEmail, getCurrentUser } from "./session-temp.js";

export async function initPago() {
  const id = getLoggedUserEmail();
  if (!id) {
    console.warn("No hay usuario logueado.");
    return;
  }
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error("No hay usuario logueado");
  }

  try {
    // 1️⃣ Obtener usuario
    const user = await fetchData(`/user/${id}`, "GET");

    // 2️⃣ Obtener tarjetas del usuario
    let cards = await fetchData(`/users/${currentUser.id}/cards`, "GET");

    const contenedor = document.getElementById("pagos");
    contenedor.innerHTML = `
      <h3 class="titulo-seccion">Métodos de Pago</h3>
      <ul id="lista-pagos" class="list-group mb-3"></ul>

      <h5>Agregar nuevo método</h5>
      <form id="form-pago">
        <div class="mb-2">
          <input type="text" id="numeroTarjeta" class="form-control" placeholder="Número de tarjeta" maxlength="16" required>
        </div>
        <div class="mb-2">
          <input type="month" id="fechaExpiracion" class="form-control" required>
        </div>
        <div class="mb-2">
          <input type="text" id="cvv" class="form-control" placeholder="CVV" maxlength="4" required>
        </div>
        <button type="submit" class="btn btn-pink">Guardar tarjeta</button>
      </form>
    `;

    const lista = document.getElementById("lista-pagos");
    const formCrear = document.getElementById("form-pago");

    // Render inicial
    renderLista(cards);

    // 3️⃣ Crear nueva tarjeta
    formCrear.addEventListener("submit", async (e) => {
      e.preventDefault();

      const numero = document.getElementById("numeroTarjeta").value.trim();
      const fecha = document.getElementById("fechaExpiracion").value;
      const cvv = document.getElementById("cvv").value.trim();

      if (!numero || !fecha || !cvv) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Todos los campos son obligatorios.",
          confirmButtonColor: "#e946c2",
          confirmButtonText: "Entendido",
        });
        return;
      }

      if (!/^\d{16}$/.test(numero) || !/^\d{3,4}$/.test(cvv)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Número de tarjeta o CVV inválido.",
          confirmButtonColor: "#e946c2",
          confirmButtonText: "Entendido",
        });
        return;
      }

      // Validación de fecha no pasada
      const today = new Date();
      const [year, month] = fecha.split("-").map(Number);
      const expDate = new Date(year, month - 1);
      if (expDate < new Date(today.getFullYear(), today.getMonth())) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La fecha de vencimiento no puede ser pasada.",
          confirmButtonColor: "#e946c2",
          confirmButtonText: "Entendido",
        });
        return;
      }

      const nuevaCard = {
        numberCard: numero,
        expirationDate: fecha,
        cvv: cvv,
        user: { id: Number(currentUser.id) },
      };

      await fetchData("/cards", "POST", {}, nuevaCard);
      Swal.fire({
        icon: "success",
        title: "Tarjeta guardada",
        text: "Tu tarjeta ha sido guardada correctamente.",
        confirmButtonColor: "#e946c2",
        confirmButtonText: "Entendido",
      });
      cards = await fetchData(`/users/${currentUser.id}/cards`, "GET");
      renderLista(cards);
      formCrear.reset();
    });

    // 4️⃣ Función para renderizar lista
    function renderLista(data) {
      lista.innerHTML = "";
      if (!data || data.length === 0) {
        lista.innerHTML = `<li class="list-group-item">No tienes tarjetas guardadas.</li>`;
        return;
      }

      data.forEach((c) => {
        const item = document.createElement("li");
        item.className = "list-group-item";
        item.innerHTML = `
          <div class="d-flex justify-content-between align-items-start">
            <div>
              **** **** **** ${c.numberCard.slice(-4)}<br>
              Expira: ${c.expirationDate}
            </div>
            <div>
              <button class="btn btn-sm btn-pink me-2 editar-btn">Editar</button>
              <button class="btn btn-sm btn-rosewood eliminar-btn">Eliminar</button>
            </div>
          </div>
        `;

        // Eliminar tarjeta
        item
          .querySelector(".eliminar-btn")
          .addEventListener("click", async () => {
            const confirm = await Swal.fire({
              title: "¿Estás seguro?",
              text: "Esta acción no se puede deshacer.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#e946c2",
              cancelButtonColor: "#d33",
              confirmButtonText: "Sí, eliminar",
              cancelButtonText: "Cancelar",
            });

            if (confirm.isConfirmed) {
              await fetchData(`/cards/${c.id}`, "DELETE");
              Swal.fire({
                icon: "success",
                title: "Tarjeta eliminada",
                text: "Tu tarjeta ha sido eliminada correctamente.",
                confirmButtonColor: "#e946c2",
                confirmButtonText: "Entendido",
              });
              cards = await fetchData(`/users/${currentUser.id}/cards`, "GET");
              renderLista(cards);
            }
          });

        // Editar tarjeta → formulario inline
        item.querySelector(".editar-btn").addEventListener("click", () => {
          mostrarFormularioEdicion(item, c);
        });

        lista.appendChild(item);
      });
    }

    // 5️⃣ Formulario inline para edición
    function mostrarFormularioEdicion(item, card) {
      if (item.querySelector(".form-edicion")) return;

      const form = document.createElement("form");
      form.className = "form-edicion mt-3";
      form.innerHTML = `
        <input type="text" value="${card.numberCard}" class="form-control mb-2" maxlength="16" id="edit-numero">
        <input type="month" value="${card.expirationDate}" class="form-control mb-2" id="edit-fecha">
        <input type="text" value="${card.cvv}" class="form-control mb-2" maxlength="4" id="edit-cvv">
        <button type="submit" class="btn btn-pink btn-sm me-2">Guardar cambios</button>
        <button type="button" class="btn btn-rosewood btn-sm cancelar-btn">Cancelar</button>
      `;

      // Guardar cambios
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updated = {
          numberCard: form.querySelector("#edit-numero").value.trim(),
          expirationDate: form.querySelector("#edit-fecha").value,
          cvv: form.querySelector("#edit-cvv").value.trim(),
          user: { id: Number(currentUser.id) },
        };

        if (!updated.numberCard || !updated.expirationDate || !updated.cvv) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Todos los campos son obligatorios.",
            confirmButtonColor: "#e946c2",
            confirmButtonText: "Entendido",
          });
          return;
        }

        // Validar fecha no pasada
        const today = new Date();
        const [year, month] = updated.expirationDate.split("-").map(Number);
        const expDate = new Date(year, month - 1);
        if (expDate < new Date(today.getFullYear(), today.getMonth())) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La fecha de vencimiento no puede ser pasada.",
            confirmButtonColor: "#e946c2",
            confirmButtonText: "Entendido",
          });
          return;
        }

        await fetchData(`/cards/${card.id}`, "PUT", {}, updated);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Tarjeta actualizada correctamente.",
          confirmButtonColor: "#e946c2",
          confirmButtonText: "Entendido",
        });

        cards = await fetchData(`/users/${currentUser.id}/cards`, "GET");
        renderLista(cards);
      });

      // Cancelar edición
      form.querySelector(".cancelar-btn").addEventListener("click", () => {
        form.remove();
      });

      item.appendChild(form);
    }
  } catch (error) {
    console.error("Error cargando métodos de pago:", error);
  }
}
