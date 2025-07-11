import { mostrarPaginaActiva } from "./functions/displayActiveLink.js";
import { checkCurrentUser } from "../functions/checkCurrentUser.js";

document.addEventListener("DOMContentLoaded", () => {
  mostrarPaginaActiva()
  checkCurrentUser()
  window.addEventListener('hashchange', () => mostrarPaginaActiva());
});