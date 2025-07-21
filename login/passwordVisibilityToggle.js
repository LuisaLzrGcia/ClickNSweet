// Detectar si el navegador ya incluye el ícono nativo
function browserSupportsNativeToggle() {
  const ua = navigator.userAgent;
  return /Edg|Edge|SamsungBrowser/.test(ua);
}

// Función para manejar el toggle del password
export function initializePasswordToggle(passwordInputId, toggleBtnId) {
  const passwordInput = document.getElementById(passwordInputId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const toggleIcon = document.getElementById("togglePasswordIcon");

  if (!passwordInput || !toggleBtn) {
    console.error("No se encontraron los elementos de contraseña o botón.");
    return;
  }

  // Ocultar el botón de toggle si el navegador ya lo incluye
  if (browserSupportsNativeToggle()) {
    toggleBtn.style.display = "none";
  }

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    // Alternar íconos
    toggleIcon.classList.toggle("bi-eye", isPassword);
    toggleIcon.classList.toggle("bi-eye-slash", !isPassword);

    ["copy", "cut", "dragstart"].forEach(evt =>
        passwordInput.addEventListener(evt, (e) => e.preventDefault())
    );
  });
}
