import { login } from './auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll("#loginForm input");
    let valid = true;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const errorMessageDiv = input.parentElement.querySelector(".errorMessage");

      // Si está vacío, marcamos error
      if (input.value.trim() === "") {
        valid = false;
        input.classList.add("input-error");
        if (errorMessageDiv) {
          errorMessageDiv.textContent = "Este campo es obligatorio";
          errorMessageDiv.style.display = "block";
        }
      } else {
        input.classList.remove("input-error");
        if (errorMessageDiv) {
          errorMessageDiv.style.display = "none";
          errorMessageDiv.textContent = "";
        }
      }
    }

    if (!valid) return;

    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    try {
      login(email, password)
        .then(usuario => {
          console.log("¡Inicio de sesión exitoso!", usuario);
          alert("Inicio de sesión exitoso");
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

  // Validación en tiempo real (opcional)
  const inputs = document.querySelectorAll("#loginForm input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", () => {
      inputs[i].classList.remove("input-error");

      const errorMessageDiv = inputs[i].parentElement.querySelector(".errorMessage");
      if (errorMessageDiv) {
        errorMessageDiv.style.display = "none";
        errorMessageDiv.textContent = "";
      }
    });
  }
});

