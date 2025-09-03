// router.js

// Detectar si hay una subcarpeta en el dominio
export function getBasePath() {
    // Caso de GitHub Pages
    if (window.location.host.includes('github.io')) {
        const pathSegments = window.location.pathname.split('/');
        return pathSegments[1] ? `/${pathSegments[1]}` : '';
    }

    // Caso de desarrollo / producción
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const path = window.location.pathname;
        return path.split('/')[1] ? `/${path.split('/')[1]}` : '';
    }

    return '';
}

// Obtener la ruta actual relativa al basePath
export function getCurrentPath() {
    const base = getBasePath();
    let path = window.location.pathname.replace(base, '') || '/';
    return path.split("?")[0]; // ignorar query params
}

// Resolver path relativo a basePath
export function resolvePath(path) {
    const base = getBasePath();
    return `${base}${path.startsWith('/') ? path : `/${path.replace(/^\.\.\//, '')}`}`;
}

// Verificar si el path coincide con la ruta actual
export function isActive(path) {
    const current = getCurrentPath().replace(/\/$/, ''); // quitar slash final
    let normalizedPath = path.replace(/\/$/, ''); // quitar slash final
    normalizedPath = normalizedPath.replace(/^\.\.\//, '/'); // quitar ../ inicial

    // Comparar ruta actual con ruta normalizada
    return current === normalizedPath || current === `${normalizedPath}/index.html`;
}

// Mostrar categoría activa si hay hash
export function mostrarRegionActiva() {
    const currentHash = window.location.hash;
    if (!currentHash) return;

    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const dropdownItems = document.querySelectorAll(".dropdown-menu .dropdown-item");

    navLinks.forEach(link => link.classList.remove("active"));
    dropdownItems.forEach(item => item.classList.remove("active"));

    dropdownItems.forEach(item => {
        const href = item.getAttribute("href");
        if (href && href.includes(currentHash)) {
            item.classList.add('active');

            // Activar botón padre "Categorías"
            const parentDropdownToggle = item.closest(".dropdown")?.querySelector(".nav-link.dropdown-toggle");
            if (parentDropdownToggle) {
                parentDropdownToggle.classList.add("active");
            }
        }
    });
}
