
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
            role: 'user' 
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