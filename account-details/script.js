import { initPerfil } from "./perfil.js";
import { initPago } from "./pago.js";
import { initDireccion } from "./direccion.js";
import { getCurrentUser } from "./session-temp.js";
import { initPedido } from "./pedido.js";
document.addEventListener("DOMContentLoaded", () => {
  const usuario = getCurrentUser();
  console.log("Usuario login:", usuario);
  if (!usuario) {
    window.location.href = "login.html"; // Redirigir si no hay usuario logueado
    return;
  }

  const botonesMenu = document.querySelectorAll(
    ".list-group-item[data-section]"
  );
  const secciones = document.querySelectorAll(".col-md-9 > div");

  botonesMenu.forEach((boton) => {
    boton.addEventListener("click", () => {
      const objetivo = boton.getAttribute("data-section");

      // Marcar activo el botón
      botonesMenu.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");

      // Ocultar todas las secciones
      secciones.forEach((sec) => sec.classList.add("d-none"));

      // Mostrar la sección seleccionada
      const seccionMostrar = document.getElementById(objetivo);
      if (seccionMostrar) {
        seccionMostrar.classList.remove("d-none");
      }
    });
  });
  initPerfil();
  initPago();
  initDireccion();
  initPedido();
});
