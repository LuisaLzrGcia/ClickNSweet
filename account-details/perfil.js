import fetchData from "../fetchData/fetchData.js";
import { getLoggedUserEmail } from "./session-temp.js";
import { getCurrentUser } from "./session-temp.js";

export async function initPerfil() {
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
    const user = await fetchData(`/user/${id}`, "GET");

    const contenedor = document.getElementById("perfil");
    contenedor.innerHTML = `
      <h3 class="titulo-seccion">Perfil de Usuario</h3>
      <form id="form-perfil">
        <div class="mb-3">
          <label>Nombre </label>
          <input type="text" class="form-control" id="input-nombre" value="${
            user.firstName || ""
          }" disabled>
        </div>
        <div class="mb-3">
          <label>Apellido</label>
          <input type="text" class="form-control" id="input-apellido" value="${
            user.lastName || ""
          }" disabled>
        </div>
        <div class="mb-3">
          <label>Correo electrónico</label>
          <input type="email" class="form-control" id="input-email" value="${
            user.email || ""
          }" disabled>
        </div>
        <div class="mb-3">
          <label>Teléfono</label>
          <input type="text" class="form-control" id="input-telefono" maxlength="10" value="${
            user.phone || ""
          }" disabled>
        </div>
        
        <button type="button" id="btn-editar" class="btn btn-pink me-2">Editar</button>
        <button type="submit" id="btn-guardar" class="btn btn-pink" disabled>Guardar</button>
      </form>
    `;

    const form = document.getElementById("form-perfil");
    const inputs = form.querySelectorAll("input");
    const btnEditar = document.getElementById("btn-editar");
    const btnGuardar = document.getElementById("btn-guardar");

    btnEditar.addEventListener("click", () => {
      inputs.forEach((input) => {
        if (input.id !== "input-email") input.disabled = false;
      });
      btnGuardar.disabled = false;
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let valido = true;
      inputs.forEach((input) => {
        if (input.disabled) return;
        if (input.value.trim() === "") {
          input.classList.add("is-invalid");
          valido = false;
        } else {
          input.classList.remove("is-invalid");
        }
      });

      if (!valido) return;

      // Actualizar en backend
      const updatedUser = {
        firstName: document.getElementById("input-nombre").value.trim(),
        lastName: document.getElementById("input-apellido").value.trim(),
        phone: document.getElementById("input-telefono").value.trim(),
      };

      await fetchData(
        `/update-user/${currentUser.id}`,
        "PATCH",
        {},
        updatedUser
      );

      Swal.fire({
        icon: "success",
        title: "Actualización exitosa",
        text: "Tu perfil ha sido actualizado correctamente.",
        confirmButtonColor: "#e946c2",
        confirmButtonText: "Entendido",
      });

      inputs.forEach((input) => {
        input.disabled = true;
        input.classList.remove("is-invalid");
      });
      btnGuardar.disabled = true;
    });
  } catch (error) {
    console.error("Error cargando perfil:", error);
  }
}
