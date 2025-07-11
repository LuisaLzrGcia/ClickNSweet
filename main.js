import { displayActiveLink } from "./functions/displayActiveLink.js";
import { preventLoginIfAuthenticated } from "./functions/preventLoginIfAuthenticated.js";
import { updateNavbarAuthState } from "./functions/updateNavbarAuthState.js";
import { logout } from "./login/auth.js";

const logoutButton = document.getElementById("logout");

document.addEventListener("DOMContentLoaded", () => {
  displayActiveLink()
  updateNavbarAuthState()
  preventLoginIfAuthenticated()
  window.addEventListener('hashchange', () => displayActiveLink());

});

  logoutButton.addEventListener("click", () => logout())

