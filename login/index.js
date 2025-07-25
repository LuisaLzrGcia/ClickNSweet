import { loginFormValidation } from "../functions/login/loginFormValidation.js";
import { hideErrorMessages, showErrorMessages } from "../functions/login/errorDisplay.js";
import { login } from "./auth.js";
import { initializePasswordToggle } from "./passwordVisibilityToggle.js";

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

    const email = usernameInput.value;
    const password = passwordInput.value;

    
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
        .then(usuario => {
          console.log("¡Inicio de sesión exitoso!", usuario);
          alert("Inicio de sesión exitoso");
          window.document.location.href = "/index.html"; // Redirige al inicio
        })
        .catch(error => {
          console.error("Error en login:", error.message);
          alert("No se pudo iniciar sesión: " + error.message);
        });
    } catch (error) {
      console.error("Error inesperado:", error.message);
      alert("Ocurrió un error inesperado");
    }
  });
});