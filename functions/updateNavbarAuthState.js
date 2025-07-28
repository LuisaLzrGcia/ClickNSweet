import { getCurrentUser } from "../login/auth.js";

const autenticacionLinks = document.querySelectorAll(".autenticacion");
const navLinkAdmin = document.querySelectorAll(".nav-item-admin");
const navLinkUser = document.querySelectorAll(".nav-item-user");
const userMenu = document.querySelector(".user-menu");

export function updateNavbarAuthState() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    if (currentUser.role === "admin") {
      navLinkAdmin.forEach((navLink) => {
        navLink.classList.remove("d-none");
      });
      navLinkUser.forEach((navLink) => {
        navLink.classList.add("d-none");
      });
    }
    autenticacionLinks.forEach((el) => el.classList.add("d-none"));
    userMenu?.classList.remove("d-none");
    console.log("Usuario logueado:", currentUser);
  } else {
    autenticacionLinks.forEach((el) => el.classList.remove("d-none"));
    userMenu?.classList.add("d-none");
    console.log("Ningún usuario logueado.");
  }
}
