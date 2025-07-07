import { mostrarPaginaActiva } from "./functions/displayActiveLink.js";

document.addEventListener("DOMContentLoaded", () => {
  mostrarPaginaActiva()
  window.addEventListener('hashchange', () => mostrarPaginaActiva());
});



