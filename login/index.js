import { loginFormValidation } from "../functions/login/loginFormValidation.js";
import { hideErrorMessages, showErrorMessages } from "../functions/login/errorDisplay.js";
import { login } from "./auth1.js";
import { initializePasswordToggle } from "./passwordVisibilityToggle.js";
import { resolvePath } from "../navbar/router.js";

function isAdmin(usuario) {
  // 1) Si role es string
  if (typeof usuario?.role === "string" && usuario.role.toLowerCase() === "admin") return true;

  // 2) Si role es número (2 = admin)
  if (typeof usuario?.role === "number" && Number(usuario.role) === 2) return true;

  // 3) Si role es objeto
  if (usuario?.role && typeof usuario.role === "object") {
    const t = usuario.role.roleType || usuario.role.type || usuario.role.name;
    const id = usuario.role.id ?? usuario.role.roleId ?? usuario.role.role_id;
    if (typeof t === "string" && t.toLowerCase() === "admin") return true;
    if (Number(id) === 2) return true;
  }

  // 4) Si viene separado
  const rid = usuario?.roleId ?? usuario?.role_id;
  if (Number(rid) === 2) return true;

  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usernameInput = document.getElementById("inputEmail");
  const passwordInput = document.getElementById("inputPassword");
  const inputs = document.querySelectorAll("#loginForm input");

  initializePasswordToggle("inputPassword", "togglePassword");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      hideErrorMessages(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = (usernameInput.value || "").trim(); // no forzamos lower por si el backend es case-sensitive
    const password = passwordInput.value || "";

    const dataIsValid = loginFormValidation(email, password);

    if (!dataIsValid.isValid) {
      if (dataIsValid.field === "Email") {
        showErrorMessages(usernameInput, dataIsValid.message);
        return;
      }
      if (dataIsValid.field === "Password") {
        showErrorMessages(passwordInput, "Por favor, ingresa tu contraseña");
        return;
      }
    }

    try {
      login(email, password)
        .then((usuario) => {
          // Normalizamos lo que guardamos en localStorage (no cambiamos tu lógica)
          const currentUser = {
            id: usuario.id ?? usuario.id_user ?? usuario.userId,
            username: usuario.userName ?? usuario.username ?? email,
            email: usuario.email ?? email,
            name: usuario.firstName + " " + usuario.lastName,
            role: usuario.role.type,

          };
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          localStorage.setItem("usuario", JSON.stringify(currentUser));

          console.log("¡Inicio de sesión exitoso!", usuario);





          alert("Inicio de sesión exitoso");
          const homePage = isAdmin(usuario)
            ? resolvePath("../main-manage-products/index.html")
            : resolvePath("../index.html");
          window.document.location.href = homePage;
        })
        .catch((error) => {
          console.error("Error en login:", error.message);
          alert("No se pudo iniciar sesión: " + error.message);
        });
    } catch (error) {
      console.error("Error inesperado:", error.message);
      alert("Ocurrió un error inesperado");
    }
  });
});


