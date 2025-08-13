export function getLoggedUserEmail() {
  const usuarioData = localStorage.getItem("usuario");
  if (!usuarioData) return null;

  try {
    const usuario = JSON.parse(usuarioData);
    return usuario.id || null;
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const usuarioData = localStorage.getItem("usuario");
  if (!usuarioData) return null;
  try {
    return JSON.parse(usuarioData);
  } catch {
    return null;
  }
}
