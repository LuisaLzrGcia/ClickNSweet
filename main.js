import { displayActiveLink } from "./functions/displayActiveLink.js";
import { preventLoginIfAuthenticated } from "./functions/preventLoginIfAuthenticated.js";
import { updateNavbarAuthState } from "./functions/updateNavbarAuthState.js";
import { logout } from "./login/auth.js";
const navbarLinks = document.querySelector(".navbar-nav");
const logoutButton = document.getElementById("logout");

document.addEventListener("DOMContentLoaded", () => {
  displayActiveLink();
  updateNavbarAuthState();
  preventLoginIfAuthenticated();
  window.addEventListener("hashchange", () => displayActiveLink());
  navbarLinks.classList.remove("invisible");
  logoutButton.addEventListener("click", () => logout());
});
