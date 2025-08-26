import fetchData from "../fetchData/fetchData.js";

export async function register(userData) {
    try {
        console.log('Intentando registro con backend:', {
            email: userData.email,
            firstName: userData.firstName
        });

        const userForBackend = {
            firstName: userData.firstName,
            lastName: userData.lastName || '',
            user_name: userData.userName || userData.email.split('@')[0],
            email: userData.email.toLowerCase().trim(),
            password: userData.password,
            phone: userData.phone,
            birth_date: userData.fechaNacimiento,
            role: { id: 1 } // Rol por defecto
        };

        const newUser = await fetchData('/create-user', 'POST', {}, userForBackend);

        console.log('Usuario registrado exitosamente:', newUser);

        return newUser;

    } catch (error) {
        console.error('Error en registro con backend:', error);

        let errorMessage = 'Error al crear la cuenta';

        if (error.message) {
            if (error.message.includes('409') || error.message.includes('CONFLICT')) {
                errorMessage = 'Ya existe una cuenta con este correo electrónico o nombre de usuario';
            } else if (error.message.includes('400')) {
                errorMessage = 'Datos inválidos. Verifica la información ingresada';
            } else if (error.message.includes('500')) {
                errorMessage = 'Error interno del servidor. Intenta más tarde';
            } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
                errorMessage = 'No se puede conectar al servidor. Verifica que esté ejecutándose';
            }
        }

        throw new Error(errorMessage);
    }
    
}
import { register } from './auth1.js';

document.getElementById('btnRegistro').addEventListener('click', async () => {
  const userData = {
    firstName: document.getElementById('nombre').value,
    lastName: document.getElementById('apellido').value,
    userName: document.getElementById('usuario').value,
    email: document.getElementById('correo').value,
    password: document.getElementById('password').value,
    phone: document.getElementById('telefono').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value
  };

  try {
    const nuevoUsuario = await register(userData);
    console.log('Usuario creado:', nuevoUsuario);
    alert('¡Registro exitoso!');
    window.location.href = '/login/index.html';
  } catch (error) {
    console.error('Error en registro:', error);
    alert(error.message);
  }
});

import { register } from './auth1.js';

document.getElementById('btnRegistro').addEventListener('click', async () => {
  const userData = {
    firstName: document.getElementById('nombre').value,
    lastName: document.getElementById('apellido').value,
    userName: document.getElementById('usuario').value,
    email: document.getElementById('correo').value,
    password: document.getElementById('password').value,
    phone: document.getElementById('telefono').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value
  };

  try {
    const nuevoUsuario = await register(userData);
    console.log('Usuario creado:', nuevoUsuario);
    
  
    const userForStorage = {
        id: nuevoUsuario.id,
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        username: nuevoUsuario.username,
        role: nuevoUsuario.role
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userForStorage));
    console.log('Usuario guardado en localStorage:', userForStorage);
    
    
    alert(`¡Registro exitoso! 
    Bienvenido ${nuevoUsuario.name}
    Tu rol es: ${nuevoUsuario.role}`);
    
    window.location.href = '../login.html';
    
  } catch (error) {
    console.error('Error en registro:', error);
    alert(error.message);
  }
});