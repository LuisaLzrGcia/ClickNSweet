import fetchData from "../fetchData/fetchData.js";
import { getLoggedUserEmail } from "./session-temp.js";
import { getCurrentUser } from "./session-temp.js";
export async function initDireccion() {
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
    console.log("Usuario actual:", user);

    // 2️⃣ Obtener direcciones del usuario
    let direcciones = await fetchData(`/address/user/${currentUser.id}`, "GET");
    console.log("Direcciones:", direcciones);

    const contenedor = document.getElementById("direcciones");
    contenedor.innerHTML = `
      <h3 class="titulo-seccion">Direcciones guardadas</h3>
      <ul id="lista-direcciones" class="list-group mb-3"></ul>

      <h5>Agregar nueva dirección</h5>
      <form id="form-direccion">
        <div class="mb-2">
          <input type="text" id="address" class="form-control" placeholder="Calle y número" required>
        </div>
        <div class="mb-2">
          <input type="text" id="city" class="form-control" placeholder="Ciudad" required>
        </div>
        <div class="mb-2">
          <input type="text" id="country" class="form-control" placeholder="País" required>
        </div>
        <div class="mb-2">
          <input type="text" id="region" class="form-control" placeholder="Región (opcional)">
        </div>
        <div class="mb-2">
          <input type="text" id="type_address" class="form-control" placeholder="Tipo de dirección (Ej. Casa, Trabajo)">
        </div>
        <button type="submit" class="btn btn-pink">Guardar dirección</button>
      </form>
    `;

    const lista = document.getElementById("lista-direcciones");
    const formCrear = document.getElementById("form-direccion");

    // Render inicial
    renderLista(direcciones);

    // 3️⃣ Crear nueva dirección
    formCrear.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nuevaDireccion = {
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        country: document.getElementById("country").value.trim(),
        region: document.getElementById("region").value.trim() || null,
        typeAddress:
          document.getElementById("type_address").value.trim() || null,
        user: { id: Number(currentUser.id) },
      };

      if (
        !nuevaDireccion.address ||
        !nuevaDireccion.city ||
        !nuevaDireccion.country
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Los campos Calle y número, Ciudad y País son obligatorios.",
          confirmButtonColor: "#e946c2",
          confirmButtonText: "Entendido",
        });
        return;
      }

      await fetchData("/address", "POST", {}, nuevaDireccion);
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Dirección guardada correctamente.",
        confirmButtonColor: "#e946c2",
        confirmButtonText: "Entendido",
      });

      direcciones = await fetchData(`/address/user/${currentUser.id}`, "GET");
      renderLista(direcciones);
      formCrear.reset();
    });

    // 4️⃣ Función para renderizar lista
    function renderLista(data) {
      lista.innerHTML = "";
      if (!data || data.length === 0) {
        lista.innerHTML = `<li class="list-group-item">No tienes direcciones guardadas.</li>`;
        return;
      }

      data.forEach((d) => {
        const item = document.createElement("li");
        item.className = "list-group-item";
        item.innerHTML = `
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong>${d.typeAddress}</strong><br>
              ${d.address}, ${d.city}, ${d.country}${
          d.region ? `, ${d.region}` : ""
        }
            </div>
            <div>
              <button class="btn btn-sm btn-pink me-2 editar-btn">Editar</button>
              <button class="btn btn-sm btn-rosewood eliminar-btn">Eliminar</button>
            </div>
          </div>
        `;

        // Eliminar dirección
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
              await fetchData(`/address/${d.id}`, "DELETE");
              Swal.fire({
                icon: "success",
                title: "Éxito",
                text: "Dirección eliminada correctamente.",
                confirmButtonColor: "#e946c2",
                confirmButtonText: "Entendido",
              });
              direcciones = await fetchData(
                `/address/user/${currentUser.id}`,
                "GET"
              );
              renderLista(direcciones);
            }
          });

        // Editar dirección → formulario inline
        item.querySelector(".editar-btn").addEventListener("click", () => {
          mostrarFormularioEdicion(item, d);
        });

        lista.appendChild(item);
      });
    }

    // 5️⃣ Formulario inline para edición
    function mostrarFormularioEdicion(item, direccion) {
      // Evitar que se abra más de un formulario en la misma dirección
      if (item.querySelector(".form-edicion")) return;

      const form = document.createElement("form");
      form.className = "form-edicion mt-3";
      form.innerHTML = `
        <input type="text" placeholder="Calle y numero" value="${
          direccion.address
        }" class="form-control mb-2" id="edit-address">
        <input type="text" placeholder="Ciudad" value="${
          direccion.city
        }" class="form-control mb-2" id="edit-city">
        <input type="text" placeholder="País" value="${
          direccion.country
        }" class="form-control mb-2" id="edit-country">
        <input type="text" placeholder="Región" value="${
          direccion.region || ""
        }" class="form-control mb-2" id="edit-region">
        <input type="text" placeholder="Tipo de dirección (Ej: Casa, Trabajo)" value="${
          direccion.typeAddress || ""
        }" class="form-control mb-2" id="edit-type">
        <button type="submit" class="btn btn-pink btn-sm me-2">Guardar cambios</button>
        <button type="button" class="btn btn-rosewood btn-sm cancelar-btn">Cancelar</button>
      `;

      // Guardar cambios
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updated = {
          address: form.querySelector("#edit-address").value.trim(),
          city: form.querySelector("#edit-city").value.trim(),
          country: form.querySelector("#edit-country").value.trim(),
          region: form.querySelector("#edit-region").value.trim() || null,
          typeAddress: form.querySelector("#edit-type").value.trim() || null,
          user: { id: Number(currentUser.id) },
        };

        if (!updated.address || !updated.city || !updated.country) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Los campos Calle y número, Ciudad y País son obligatorios.",
            confirmButtonColor: "#e946c2",
            confirmButtonText: "Entendido",
          });
          return;
        }

        await fetchData(`/address/${direccion.id}`, "PUT", {}, updated);
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Dirección actualizada correctamente.",
          confirmButtonColor: "#e946c2",
          confirmButtonText: "Entendido",
        });

        direcciones = await fetchData(`/address/user/${user.id}`, "GET");
        renderLista(direcciones);
      });

      // Cancelar edición
      form.querySelector(".cancelar-btn").addEventListener("click", () => {
        form.remove();
      });

      // Insertar el formulario justo después del contenido de la dirección
      item.appendChild(form);
    }
  } catch (error) {
    console.error("Error cargando direcciones:", error);
  }
}
