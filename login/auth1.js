import fetchData from "../fetchData/fetchData.js";

// 📝 LOGIN
export async function login(email, password) {
  try {
    const response = await fetchData('/login', 'POST', {}, { email, password });
    
    // ✅ NUEVO: Guardar usuario en localStorage después del login
    const userForStorage = {
      id: response.id,
      name: response.name,
      email: response.email,
      username: response.username,
      role: response.role.type
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userForStorage));
    console.log('Usuario logueado y guardado:', userForStorage);
    
    return response; // devuelve directamente el objeto User

  } catch (error) {
    console.error('Error en login:', error);
    throw new Error('Credenciales inválidas o error de conexión');
  }
}

export async function register(userData) {
  try {
    // ✅ Validaciones previas (mantén tu lógica actual)
    const firstName = userData.firstName?.trim();
    const lastName = userData.lastName?.trim() || 'SinApellido';
    const email = userData.email?.toLowerCase().trim();
    const password = userData.password;
    const phone = userData.phone?.trim() || '';

    // Generar userName seguro
    let userName = userData.userName?.trim();
    if (!userName || userName === '') {
      if (email && email.includes('@')) {
        userName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      }
      if (!userName || userName === '') {
        userName = 'user' + Date.now();
      }
    }
    if (!userName || userName.trim() === '') {
      userName = 'defaultuser' + Date.now();
    }

    // ⚠️ Validaciones críticas
    if (!firstName) throw new Error('El nombre es requerido');
    if (!lastName) throw new Error('El apellido es requerido');
    if (!userName) throw new Error('El nombre de usuario es requerido');
    if (!email) throw new Error('El email es requerido');
    if (!password) throw new Error('La contraseña es requerida');

    // Datos para el backend
    const userForBackend = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: password,
      phone: phone,
      role: { id: 1 } // ✅ Rol por defecto (USER)
    };

    // 🔍 Debug
    console.log('=== VALIDACIÓN FINAL DE CAMPOS ===');
    Object.keys(userForBackend).forEach(key => {
      const value = userForBackend[key];
      console.log(`${key}:`, value, `(tipo: ${typeof value})`);
      if (value === null || value === undefined || value === '') {
        console.error(`⚠️ CAMPO PROBLEMÁTICO: ${key} es ${value}`);
      }
    });

    console.log('Datos preparados para backend:', JSON.stringify(userForBackend, null, 2));

    // Verificación de campos críticos
    const criticalFields = ['firstName', 'lastName', 'userName', 'email', 'password'];
    for (const field of criticalFields) {
      if (!userForBackend[field]) {
        throw new Error(`Campo requerido faltante o vacío: ${field}`);
      }
    }

    console.log('Intentando registro con backend:', userForBackend);
    const response = await fetchData('/create-user', 'POST', {}, userForBackend);
    console.log('Usuario registrado exitosamente:', response);

    // ✅ NUEVO: Normalizar la respuesta del backend
    const newUser = {
      id: response.id,
      name: response.name,
      email: response.email,
      username: response.username,
      role: response.role,
      message: response.message
    };

    return newUser;

  } catch (error) {
    console.error('Error en registro con backend:', error);

    let errorMessage = 'Error al crear la cuenta';

    if (error.message) {
      if (error.message.includes('Campo requerido faltante')) {
        errorMessage = error.message;
      } else if (error.message.includes('409') || error.message.includes('CONFLICT')) {
        errorMessage = 'Ya existe una cuenta con este correo electrónico o nombre de usuario';
      } else if (error.message.includes('400') || error.message.includes('BAD_REQUEST')) {
        errorMessage = 'Datos inválidos. Verifica que todos los campos estén completos';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor. Intenta más tarde';
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
        errorMessage = 'No se puede conectar al servidor';
      } else if (error.message.startsWith('El ') || error.message.startsWith('La ')) {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  }

}


