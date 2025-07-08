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

  const validation = contactFormValidation(nombre, correo, telefono, mensaje);

  if (validation.isValid) {
    const templateParams = {
      to_name: nombre,
      correo_usuario: correo,
      telefono_usuario: telefono,
      message: mensaje,
    };

    emailjs
      .send("service_g3bdgqd", "template_9fwuwe9", templateParams)
      .then(() => {
        Swal.fire({
          title: "¡Formulario enviado!",
          text: "Nos pondremos en contacto contigo pronto.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        document.getElementById("formContactUs").reset();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error al enviar",
          text: "Ocurrió un problema. Intenta nuevamente.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("EmailJS error:", error);
      });
  } else {
    Swal.fire({
      title: validation.title,
      text: validation.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
