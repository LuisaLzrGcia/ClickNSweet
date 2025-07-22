import { displayActiveLink } from "./functions/displayActiveLink.js";
import { preventLoginIfAuthenticated } from "./functions/preventLoginIfAuthenticated.js";
import { loadCartCount } from "./functions/loadCartCount.js";
import { updateNavbarAuthState } from "./functions/updateNavbarAuthState.js";
import { logout } from "./login/auth.js";
import { handleNavbarScroll } from "./functions/navBarScrollBehavior.js";
import { showSubscribeAlert } from './functions/showSubscribeAlert.js';
import { renderFooter } from './footer/script.js';


const navbarLinks = document.querySelector(".navbar-nav");
const logoutButton = document.getElementById("logout");

document.addEventListener("DOMContentLoaded", () => {
  loadCartCount()
  displayActiveLink();
  updateNavbarAuthState();
  preventLoginIfAuthenticated();
  handleNavbarScroll();
  window.addEventListener("hashchange", () => displayActiveLink());
  navbarLinks.classList.remove("invisible");
  logoutButton.addEventListener("click", () => logout());
});
