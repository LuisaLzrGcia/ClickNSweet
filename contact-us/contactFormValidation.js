export const contactFormValidation = (name, email, phone, message) => {
    name = name.trim();
    email = email.trim();
    phone = phone.trim();
    message = message.trim();

    if (!name) {
        return { isValid: false, field: 'Nombre', title: 'Nombre requerido', message: 'Por favor ingresa tu nombre.' };
    }

    if (!email) {
        return { isValid: false, field: 'Correo electrónico', title: 'Correo electrónico requerido', message: 'Por favor ingresa tu correo electrónico.' };
    }

    if (!phone) {
        return { isValid: false, field: 'Teléfono', title: 'Teléfono requerido', message: 'Por favor ingresa tu número de teléfono.' };
    }

    if (!message) {
        return { isValid: false, field: 'Mensaje', title: 'Mensaje requerido', message: 'Por favor ingresa tu mensaje.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, field: 'Correo electrónico', title: 'Correo electrónico inválido', message: 'Por favor ingresa un correo electrónico válido.' };
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return { isValid: false, field: 'Teléfono', title: 'Teléfono inválido', message: 'El número de teléfono debe tener exactamente 10 dígitos.' };
    }

    return { isValid: true };
};
