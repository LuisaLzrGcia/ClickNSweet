export const contactFormValidation = (name, email, phone, message) => {
    name = name.trim();
    email = email.trim();
    phone = phone.trim();
    message = message.trim();

    if (!name) {
        return {
            isValid: false,
            field: 'Nombre',
            title: 'Nombre requerido',
            message: 'Por favor ingresa tu nombre.',
            type: 'campo_vacio'
        };
    }

    if (!email) {
        return {
            isValid: false,
            field: 'Correo electrónico',
            title: 'Correo electrónico requerido',
            message: 'Por favor ingresa tu correo electrónico.',
            type: 'campo_vacio'
        };
    }

    if (!phone) {
        return {
            isValid: false,
            field: 'Teléfono',
            title: 'Teléfono requerido',
            message: 'Por favor ingresa tu número de teléfono.',
            type: 'campo_vacio'
        };
    }

    if (!message) {
        return {
            isValid: false,
            field: 'Mensaje',
            title: 'Mensaje requerido',
            message: 'Por favor ingresa tu mensaje.',
            type: 'campo_vacio'
        };
    }

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nameRegex.test(name)) {
        return {
            isValid: false,
            field: 'Nombre',
            title: 'Nombre inválido',
            message: 'El nombre solo puede contener letras y espacios.',
            type: 'formato_invalido'
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

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return {
            isValid: false,
            field: 'Teléfono',
            title: 'Teléfono inválido',
            message: 'El número de teléfono debe tener exactamente 10 dígitos númericos.',
            type: 'formato_invalido'
        };
    }

    return { isValid: true };
};
