import { login } from "./auth.js";

const loginForm = document.getElementById('login');
const usernameInput = document.getElementById('inputEmail');
const passwordInput = document.getElementById('inputPassword');
const areaAutenticacion = document.querySelectorAll('.autenticacion');
// const errorMessageDiv = document.getElementById('errorMessage');

// Función para mostrar mensajes de error
function showErrorMessage(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

// Función para ocultar mensajes de error
function hideErrorMessage() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        // showErrorMessage('Por favor, ingresa tu nombre de usuario y contraseña.');
        alert("Por favor, ingresa tu nombre de usuario y contraseña")
        return;
    }

    try {
        const user = await login(username, password);
        console.log('¡Inicio de sesión exitoso!', user);
        // hideErrorMessage();
        // Redirigir al usuario a la página principal o dashboard
        console.log(areaAutenticacion)
        // alert(`¡Bienvenido, ${user.username}! Redirigiendo...`);
        window.location.href = "/"
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error.message);
        // showErrorMessage(error.message);
    }
});
