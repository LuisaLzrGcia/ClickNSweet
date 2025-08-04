import { getCurrentUser } from "../login/auth.js";

export function isAuthenticated() {
    return !!getCurrentUser();
}

export function isAdmin() {
    const user = getCurrentUser();
    return user?.role === 'admin';
}

