export function login(username, password) {
  return new Promise((resolve, reject) => {
    try {
      const usuarioData = localStorage.getItem("usuario");

      // Verificar si existe data en localStorage
      if (!usuarioData) {
        reject(new Error("No hay usuarios registrados"));
        return;
      }

      // Parsear el JSON
      const usuario = JSON.parse(usuarioData);

      // Verificar que el objeto tiene las propiedades necesarias
      if (!usuario.email || !usuario.password) {
        reject(new Error("Datos de usuario corruptos"));
        return;
      }

      // Debug: mostrar lo que se está comparando
      console.log("Email ingresado:", username);
      console.log("Email guardado:", usuario.email);
      console.log("Password ingresado:", password);
      console.log("Password guardado:", usuario.password);

      // Compara email ignorando mayúsculas y espacios
      if (
        username.toLowerCase().trim() !== usuario.email.toLowerCase().trim()
      ) {
        reject(new Error("Correo electrónico incorrecto"));
        return;
      }

      if (password !== usuario.password) {
        reject(new Error("Contraseña incorrecta"));
        return;
      }
      localStorage.setItem("currentUser", JSON.stringify(usuario));
      resolve(usuario);
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      reject(new Error("Error al acceder a los datos del usuario"));
    }
  });
}
export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("currentUser");
}
