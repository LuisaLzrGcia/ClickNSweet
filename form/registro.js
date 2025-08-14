import { register } from '../login/auth1.js'; // Ajusta la ruta según tu estructura

document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // 🔍 Captura y limpieza de datos
  const nombreCompleto = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const telefono = document.getElementById('telefono').value.trim();
  const fechaNacimiento = document.getElementById('fechaNacimiento').value;

  // 🧠 Separación segura de nombre y apellido
  const [firstName, ...lastParts] = nombreCompleto.split(' ');
  const lastName = lastParts.join(' ') || 'SinApellido';
  const userName = firstName?.toLowerCase() || 'usuario';

  // 🛡 Validación previa
  if (!firstName || !lastName || !email || !password || !telefono || !fechaNacimiento) {
    Swal.fire('Campos incompletos', 'Por favor, llena todos los campos obligatorios.', 'warning');
    return;
  }

  // 📦 Construcción del objeto
  const userData = {
    firstName,
    lastName,
    userName,
    email,
    password,
    phone: telefono,
    fechaNacimiento
  };

  console.log('Datos enviados al backend:', userData); // ✅ Verifica en consola

  try {
    const nuevoUsuario = await register(userData);
    console.log('Usuario creado:', nuevoUsuario);
    Swal.fire('¡Registro exitoso!', 'Ahora puedes iniciar sesión.', 'success');
    setTimeout(() => {
      window.location.href = '/login/index.html';
    }, 2000);
  } catch (error) {
    console.error('Error en registro:', error);
    Swal.fire('Error en el registro', error.message || 'Verifica los datos ingresados.', 'error');
  }
});