import { getCurrentUser } from "./auth.js";

export function checkCurrentUser() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('Usuario logueado:', currentUser);
    } else {
        console.log('Ningún usuario logueado.');
    }
}