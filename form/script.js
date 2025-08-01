document
  .getElementById("registroForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    document
      .getElementById("registroForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        document.querySelectorAll(".alert").forEach((alert) => alert.remove());

        const nombre = document.getElementById("nombre").value.trim();
        const fechaNacimiento = document
          .getElementById("fechaNacimiento")
          .value.trim();
        const telefono = document.getElementById("telefono")
          ? document.getElementById("telefono").value.trim()
          : "";
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword")
          ? document.getElementById("confirmPassword").value
          : "";
        const terminos = document.getElementById("terminos").checked;

        let errores = [];

        if (
          !nombre ||
          !fechaNacimiento ||
          !telefono ||
          !email ||
          !password ||
          !confirmPassword ||
          !terminos
        ) {
          errores.push(
            "Por favor, completa todos los campos y acepta los términos."
          );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errores.push("Correo electrónico inválido.");
        }

        const telefonoRegex = /^\d{10}$/;
        if (!telefonoRegex.test(telefono)) {
          errores.push("El teléfono debe tener 10 dígitos.");
        }

        if (password.length < 6) {
          errores.push("La contraseña debe tener al menos 6 caracteres.");
        }

        if (password !== confirmPassword) {
          errores.push("Las contraseñas no coinciden.");
        }

        // Obtener todos los usuarios
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar si el correo ya está registrado
        const existe = usuarios.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existe) {
          errores.push("Ya existe una cuenta con este correo electrónico.");
        }

        if (errores.length > 0) {
          errores.forEach((err) => mostrarMensaje(err, "danger"));
          return;
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
          nombreCompleto: nombre,
          fechaNacimiento,
          telefono,
          email,
          password,
          direcciones: [],
          metodosPago: [],
        };

        // Agregar nuevo usuario a la lista y guardar
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Guardar sesión actual
        localStorage.setItem("currentUser", JSON.stringify(nuevoUsuario));

        console.log("Usuario registrado exitosamente:", nuevoUsuario);
        mostrarMensaje(
          "¡Cuenta creada exitosamente! Bienvenido a Click N Sweet 🧁!",
          "success"
        );

        this.reset();

        // Redirigir al login o directamente a la cuenta
        setTimeout(() => {
          window.location.href = "../cuenta/account-details.html";
        }, 2000);
      });

    // Función para mostrar mensajes usando Bootstrap Alert
    function mostrarMensaje(mensaje, tipo) {
      const div = document.createElement("div");
      div.className = `alert alert-${tipo} mt-2`;
      div.textContent = mensaje;
      document.querySelector(".form-section").prepend(div);
    }
  });
