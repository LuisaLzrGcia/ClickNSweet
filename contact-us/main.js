import { contactFormValidation } from "./contactFormValidation.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formContactUs");
    if (form) {
        form.addEventListener("submit", formContactUs);
    }
});

// // function formContactUs(event) {
// //     event.preventDefault();
// //     console.log("entro");
// //     const nombre = document.getElementById("nombre").value.trim();
// //     const correo = document.getElementById("correo").value.trim();
// //     const telefono = document.getElementById("telefono").value.trim();
// //     const mensaje = document.getElementById("mensaje").value.trim();

// //     const validation = contactFormValidation(nombre, correo, telefono, mensaje)
// //     if (validation.isValid) {
// //         console.log("correctyo");
// //     } else { console.log("no"); }

//     if (!nombre || !correo || !telefono || !mensaje) {
//         alert("Por favor, completa todos los campos.");
//         return false;
//     }

//     // Validar formato de correo electrónico simple
//     const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!correoRegex.test(correo)) {
//         alert("Por favor, ingresa un correo electrónico válido.");
//         return false;
//     }

//     // Validar que el teléfono tenga solo números y al menos 10 dígitos
//     const telefonoRegex = /^[0-9]{10,}$/;
//     if (!telefonoRegex.test(telefono)) {
//         alert("Por favor, ingresa un número de teléfono válido (al menos 10 dígitos).");
//         return false;
//     }

//     alert("Formulario enviado correctamente.");
//     return true; // Permite el envío si todo es válido
// } function validarFormulario() {
//     const nombre = document.getElementById("nombre").value.trim();
//     const correo = document.getElementById("correo").value.trim();
//     const telefono = document.getElementById("telefono").value.trim();
//     const mensaje = document.getElementById("mensaje").value.trim();

//     if (!nombre || !correo || !telefono || !mensaje) {
//         alert("Por favor, completa todos los campos.");
//         return false;
//     }

//     // Validar formato de correo electrónico simple
//     const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!correoRegex.test(correo)) {
//         alert("Por favor, ingresa un correo electrónico válido.");
//         return false;
//     }

//     // Validar que el teléfono tenga solo números y al menos 10 dígitos
//     const telefonoRegex = /^[0-9]{10,}$/;
//     if (!telefonoRegex.test(telefono)) {
//         alert("Por favor, ingresa un número de teléfono válido (al menos 10 dígitos).");
//         return false;
//     }

//     alert("Formulario enviado correctamente.");
//     return true; // Permite el envío si todo es válido


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