import { contactFormValidation } from "./contactFormValidation.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formContactUs");
    if (form) {
        form.addEventListener("submit", formContactUs);
    }
});

function formContactUs(event) {
    event.preventDefault();
    const nombre = document.getElementById("formContactUs-name").value.trim();
    const correo = document.getElementById("formContactUs-email").value.trim();
    const telefono = document.getElementById("formContactUs-phone").value.trim();
    const mensaje = document.getElementById("formContactUs-message").value.trim();

    const validation = contactFormValidation(nombre, correo, telefono, mensaje)
    if (validation.isValid) {

        Swal.fire({
            title: '¡Formulario enviado!',
            text: 'Nos pondremos en contacto contigo pronto.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        document.querySelector("form").reset();
    } else {
        Swal.fire({
            title: validation.title,
            text: validation.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}