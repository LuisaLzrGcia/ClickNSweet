import { renderNavBar } from "./navbar.js";

export function displayNavBar(){
    renderNavBar();
    window.addEventListener('popstate', () => {
        renderNavBar();
    });
}