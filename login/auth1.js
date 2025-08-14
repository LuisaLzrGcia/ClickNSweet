
import fetchData from "../fetchData/fetchData.js";

export async function login(email, password) {
    try {
        console.log('Intentando login con backend:', { email: email });
        
        
        const user = await fetchData(`/email/${encodeURIComponent(email.toLowerCase().trim())}`, 'GET');
        
        console.log('Usuario encontrado:', user);
        
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
       
        if (user.password !== password) {
            throw new Error('Contraseña incorrecta');
        }
        
        
        console.log('Login exitoso:', user);
        
       
        localStorage.setItem('usuario', JSON.stringify(user));
        localStorage.setItem('userRole', user.role || 'user');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userEmail', user.email);
        
        
        return user;
        
    } catch (error) {
        console.error('Error en login con backend:', error);
        
        
        let errorMessage = 'Error de conexión con el servidor';
        
        if (error.message) {
            if (error.message.includes('404') || error.message.includes('not found')) {
                errorMessage = 'Correo electrónico no encontrado';
            } else if (error.message.includes('Contraseña incorrecta')) {
                errorMessage = 'Contraseña incorrecta';
            } else if (error.message.includes('Usuario no encontrado')) {
                errorMessage = 'Usuario no encontrado';
            } else if (error.message.includes('500')) {
                errorMessage = 'Error interno del servidor. Intenta más tarde';
            } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
                errorMessage = 'No se puede conectar al servidor. Verifica que esté ejecutándose';
            } else {
                errorMessage = error.message;
            }
        }
        
        throw new Error(errorMessage);
    }
}


export async function logout() {
    try {
        
        await fetchData('/auth/logout', 'POST');
        console.log('Logout exitoso en el servidor');
    } catch (error) {
        console.warn('Error al hacer logout en el servidor:', error);
       
    } finally {
    
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        console.log('Datos locales limpiados');
        
       
        window.location.href = '/login/index.html';
    }
}


export async function verifyToken() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    try {
        const response = await fetchData('/auth/verify', 'GET');
        return response;
    } catch (error) {
        console.error('Token inválido:', error);
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        throw error;
    }
}


export function getCurrentUser() {
    try {
        const userData = localStorage.getItem('usuario');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return null;
    }
}


export function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const usuario = localStorage.getItem('usuario');
    return !!(token && usuario);
}


export async function register(userData) {
    try {
        console.log('Intentando registro con backend:', { 
            email: userData.email,
            firstName: userData.firstName 
        });
        
        // Preparar datos para el backend
        const userForBackend = {
            firstName: userData.firstName,
            lastName: userData.lastName || '',
            user_name: userData.userName || userData.email.split('@')[0],
            email: userData.email.toLowerCase().trim(),
            password: userData.password,
            phone: userData.phone,
            birth_date: userData.fechaNacimiento,
            role: 'user'
        };
        
        // Llamada al endpoint de creación de usuario
        const response = await fetchData('/create-user', 'POST', {}, userForBackend);
        
        console.log('Usuario registrado exitosamente:', response);
        
        // El backend devuelve: { message: "...", user: {...} }
        const newUser = response.user || response;
        
        return newUser;
        
    } catch (error) {
        console.error('Error en registro con backend:', error);
        
        let errorMessage = 'Error al crear la cuenta';
        
        if (error.message) {
            if (error.message.includes('409') || error.message.includes('CONFLICT')) {
                errorMessage = 'Ya existe una cuenta con este correo electrónico';
            } else if (error.message.includes('400')) {
                errorMessage = 'Datos inválidos. Verifica la información';
            } else if (error.message.includes('500')) {
                errorMessage = 'Error interno del servidor. Intenta más tarde';
            } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
                errorMessage = 'No se puede conectar al servidor';
            }
        }
        
        throw new Error(errorMessage);
    }
}