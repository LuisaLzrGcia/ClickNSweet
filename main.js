import { displayActiveLink } from "./functions/displayActiveLink.js";
import { preventLoginIfAuthenticated } from "./functions/preventLoginIfAuthenticated.js";
// import { loadCartCount } from "./functions/loadCartCount.js";
import { updateNavbarAuthState } from "./functions/updateNavbarAuthState.js";
import { logout } from "./login/auth.js";
import { showSubscribeAlert } from "./functions/showSubscribeAlert.js";
import { renderFooter } from "./footer/script.js";
import { handleNavbarScroll } from "./functions/navBarScrollBehavior.js";

import { initPaymentPage } from "./payment1/payment.js";
import { protectRoutesByRole } from "./functions/protectRoutesByRole.js";
import { displayNavBar } from "./navbar/script.js";

const navbarLinks = document.querySelector(".navbar-nav");
const logoutButton = document.getElementById("logout");

document.addEventListener("DOMContentLoaded", () => {
  displayNavBar();
  // protectRoutesByRole();
  // loadCartCount();
  // displayActiveLink();
  // updateNavbarAuthState();
  // preventLoginIfAuthenticated();
  handleNavbarScroll();
  // window.addEventListener("hashchange", () => displayActiveLink());
  // navbarLinks.classList.remove("invisible");
  logoutButton?.addEventListener("click", () => logout());
  renderFooter();

  // Inicializar funcionalidad específica de página de pago
  if (window.location.pathname.includes('payment.html') || 
      document.querySelector('.payment-page')) {
    initPaymentPage();
  }

  // 1) Renderiza el footer
  renderFooter();

  // 2) Conecta el formulario de newsletter tras haberlo insertado
  const form = document.getElementById("newsletter-form");
  if (form) {
    const emailInput = form.querySelector('input[type="email"]');

    // Limpia cualquier customValidity en cuanto el usuario escribe
    emailInput.addEventListener("input", () => {
      emailInput.setCustomValidity("");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      // Regex básico: algo@dominio.ext (al menos un punto + algo)
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        emailInput.setCustomValidity("Por favor ingresa un correo completo con dominio, por ejemplo usuario@dominio.com");
        emailInput.reportValidity();
        return;
      }

      // Si pasa la validación, muestra SweetAlert y resetea el formulario
      showSubscribeAlert();
      form.reset();
    });
  }
});