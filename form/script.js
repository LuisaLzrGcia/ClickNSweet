
document.getElementById('registroForm').addEventListener('submit', function(e) {
    e.preventDefault();

   
    document.querySelectorAll('.alert').forEach(alert => alert.remove());

    const nombre = document.getElementById('nombre').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();
    const telefono = document.getElementById('telefono') ? document.getElementById('telefono').value.trim() : '';
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword') ? document.getElementById('confirmPassword').value : '';
    const terminos = document.getElementById('terminos').checked;

    let errores = [];

    if (!nombre || !fechaNacimiento || !telefono || !email || !password || !confirmPassword || !terminos) {
        errores.push('Por favor, completa todos los campos y acepta los términos.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errores.push('Correo electrónico inválido.');
    }

    const telefonoRegex = /^\d{10}$/; 
    if (!telefonoRegex.test(telefono)) {
        errores.push('El teléfono debe tener 10 dígitos.');
    }

    if (password.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (password !== confirmPassword) {
        errores.push('Las contraseñas no coinciden.');
    }

    // Verificar si el email ya existe
    const usuarioExistente = localStorage.getItem('usuario');
    if (usuarioExistente) {
        const usuario = JSON.parse(usuarioExistente);
        if (usuario.email && usuario.email.toLowerCase() === email.toLowerCase()) {
            errores.push('Ya existe una cuenta con este correo electrónico.');
        }
    }

    if (errores.length > 0) {
        errores.forEach(err => mostrarMensaje(err, 'danger'));
        return;
    }

    //  JSON 
    const usuario = {
        nombreCompleto: nombre,
        fechaNacimiento: fechaNacimiento,
        telefono: telefono,
        email: email,
        password: password
    };

    
    try {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        
        const verificacion = localStorage.getItem('usuario');
        if (!verificacion) {
            throw new Error('No se pudo guardar el usuario');
        }

        console.log('Usuario registrado exitosamente:', JSON.stringify(usuario));
        mostrarMensaje('¡Cuenta creada exitosamente! Bienvenido a Click N Sweet 🧁!', 'success');
        
        this.reset();
        
        // redirigir al login 
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        mostrarMensaje('Error al crear la cuenta. Intenta de nuevo.', 'danger');
    }
});

// Función para mostrar mensajes usando Bootstrap Alert
function mostrarMensaje(mensaje, tipo) {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo} mt-2`;
    div.textContent = mensaje;
    document.querySelector('.form-section').prepend(div);
}