export const loginFormValidation = (email, password) => {
    email = email.trim();
    password = password.trim()
    if (!email) {
        return {
            isValid: false,
            field: 'Email',
            title: 'Correo electrónico requerido',
            message: 'Por favor ingresa tu correo electrónico.',
            type: 'campo_vacio'
        };
    }
    if (!password) {
        return {
            isValid: false,
            field: 'Password',
            title: 'Contraseña requerida',
            message: 'Por favor ingresa tu contraseña.',
            type: 'campo_vacio'
        };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            field: 'Correo electrónico',
            title: 'Correo electrónico inválido',
            message: 'Por favor ingresa un correo electrónico válido.',
            type: 'formato_invalido'
        };
    }

    return { isValid: true };
};