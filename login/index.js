import { loginFormValidation } from "../functions/login/loginFormValidation.js";
import { hideErrorMessages, showErrorMessages } from "../functions/login/errorDisplay.js";
import { login } from "./auth1.js";
import { initializePasswordToggle } from "./passwordVisibilityToggle.js";

const loginForm = document.getElementById("login");
const usernameInput = document.getElementById("inputEmail");
const passwordInput = document.getElementById("inputPassword");
const inputs = document.querySelectorAll("#login input");

initializePasswordToggle("inputPassword", "togglePassword");

inputs.forEach((input) => {
  input.addEventListener("input", () => {
  input.classList.remove("input-error");

  const errorMessageDiv = input.parentElement.querySelector(".errorMessage");
  if (errorMessageDiv) {
    errorMessageDiv.style.display = "none";
    errorMessageDiv.textContent = "";
  }
});
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value;
  const password = passwordInput.value;

  const dataIsValid = loginFormValidation(username, password);
  if (!dataIsValid.isValid) {
    if (dataIsValid.field === "Email"){
      showErrorMessages(usernameInput, dataIsValid.message);
      return
    } 
    if (dataIsValid.field === "Password"){
      showErrorMessages(passwordInput, "Por favor, ingresa tu contraseña");
      return
    }
  }

  try {
    const user = await login(username, password);
    console.log("¡Inicio de sesión exitoso!", user);
    hideErrorMessages(usernameInput);
    hideErrorMessages(passwordInput);
    window.location.href = "index.html";
  } catch (error) {
    Swal.fire({
      title: "No se pudo iniciar sesión",
      text: "Verifica tu correo y contraseña e intenta nuevamente.",
      icon: "error",
      confirmButtonText: "Intentar de nuevo",
    });
    showErrorMessages(usernameInput, error.message);
    showErrorMessages(passwordInput, error.message);
  }
});
