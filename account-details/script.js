document.addEventListener("DOMContentLoaded", function () {
  const btnEditar = document.getElementById("btn-editar");
  const form = document.getElementById("form-perfil");
  const inputs = form.querySelectorAll("input");
  const btnGuardar = document.getElementById("btn-guardar");

  btnEditar.addEventListener("click", () => {
    inputs.forEach((input) => (input.disabled = false));
    btnGuardar.disabled = false;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Aquí podrías agregar lógica para enviar datos al backend
    alert("Datos guardados");
    inputs.forEach((input) => (input.disabled = true));
    btnGuardar.disabled = true;
  });

  // Cambio de secciones
  document.querySelectorAll("[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-section");

      // Toggle clase active
      document
        .querySelectorAll(".list-group-item")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostrar sección correspondiente
      ["perfil", "pedidos", "pagos", "direcciones"].forEach((id) => {
        document.getElementById(`seccion-${id}`).classList.add("d-none");
      });
      document.getElementById(`seccion-${target}`).classList.remove("d-none");
    });
  });
});
