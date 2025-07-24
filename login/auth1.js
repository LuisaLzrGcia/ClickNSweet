

export function login(username, password) {
  return new Promise((resolve, reject) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      reject(new Error('No hay usuarios registrados'));
      return;
    }

    // Compara email ignorando mayúsculas y espacios
    if (username.toLowerCase().trim() !== usuario.email.toLowerCase().trim()) {
      reject(new Error('Correo electrónico incorrecto'));
      return;
    }

    if (password !== usuario.password) {
      reject(new Error('Contraseña incorrecta'));
      return;
    }

    resolve(usuario); 
  });
}

