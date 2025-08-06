import { loadCartCount } from "../functions/loadCartCount.js";
import { renderNavBar } from "./navbar.js";
import { mostrarRegionActiva } from "./router.js";

export function displayNavBar(){
    renderNavBar();
    loadCartCount();
    window.addEventListener('popstate', () => {
        renderNavBar();
    });
    mostrarRegionActiva();
}