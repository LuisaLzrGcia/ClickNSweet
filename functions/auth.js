
export async function login(username, password) {
    return new Promise((resolve, reject) => {
        // Usuarios para pruebas
        const validUser = { username: 'usuario@example.com', password: 'contraseña123' };
        const validAdmin = { username: 'admin@example.com', password: 'admin123' };

        if (username === validUser.username && password === validUser.password) {
            const user = { id: 1, username: validUser.username, role: 'user' };
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert("Login exitoso")
            resolve(user);
        } else if (username === validAdmin.username && password === validAdmin.password) {
            const user = { id: 2, username: validAdmin.username, role: 'admin' };
            localStorage.setItem('currentUser', JSON.stringify(user));
            resolve(user);
        } else {
            reject(new Error('Nombre de usuario o contraseña incorrectos.'));
        }
    });
}

export function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('currentUser');
    console.log('Sesión cerrada.');
}
