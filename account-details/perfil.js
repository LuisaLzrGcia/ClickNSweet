export function initPerfil() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const contenedor = document.getElementById("perfil");
  contenedor.innerHTML = `
    <h3 class="titulo-seccion">Perfil de Usuario</h3>
    <form id="form-perfil">
      <div class="mb-3">
        <label>Nombre completo</label>
        <input type="text" class="form-control" id="input-nombre" value="${user.nombreCompleto}" disabled>
      </div>
      <div class="mb-3">
        <label>Correo electrónico</label>
        <input type="email" class="form-control" value="${user.email}" disabled>
      </div>
      <div class="mb-3">
        <label>Fecha de nacimiento</label>
        <input type="date" class="form-control" id="input-fecha" value="${user.fechaNacimiento}" disabled>
      </div>
      <div class="mb-3">
        <label>Teléfono</label>
        <input type="text" class="form-control" id="input-telefono" value="${user.telefono}" disabled>
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

  form.addEventListener("submit", (e) => {
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

    // Actualizar datos en localStorage
    user.nombreCompleto = document.getElementById("input-nombre").value.trim();
    user.fechaNacimiento = document.getElementById("input-fecha").value.trim();
    user.telefono = document.getElementById("input-telefono").value.trim();

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("usuario", JSON.stringify(user)); // si lo usas en otras secciones

    alert("Perfil actualizado correctamente.");

    inputs.forEach((input) => {
      input.disabled = true;
      input.classList.remove("is-invalid");
    });
    btnGuardar.disabled = true;
  });
}
