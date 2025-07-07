import { contactFormValidation } from "./contactFormValidation.js";


function formContactUs(event) {
    event.preventDefault();
    console.log("entro");
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    const validation = contactFormValidation(nombre, correo, telefono, mensaje)
    if (validation.isValid) {
        console.log("correctyo");
    } else { console.log("no"); }

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
}