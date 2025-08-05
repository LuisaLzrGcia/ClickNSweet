// Detectar si hay una subcarpeta en el dominio
export function getBasePath() {
    // Caso de github pages
    if (window.location.host.includes('github.io')) {
        const pathSegments = window.location.pathname.split('/');
        return pathSegments[1] ? `/${pathSegments[1]}` : '';
    }
    
    // Caseo de desarrollo
    if (window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
        const path = window.location.pathname;
        return path.split('/')[1] ? `/${path.split('/')[1]}` : '';
    }
    
    return '';
}

export function getCurrentPath() {
    const base = getBasePath();
    return window.location.pathname.replace(base, '') || '/';
}

export function resolvePath(path) {
    const base = getBasePath();
    // if (path.startsWith('#')) {
    //     return `${base}${path}`;
    // }  
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isActive(path) {
    const currentHash = window.location.hash;
    if (currentHash) {        
        return
    }
    const current = getCurrentPath().replace(/\/$/, '');
    const compare = path.replace(/\/$/, '');
    return current === compare || current === `${compare}/index.html`;
}

export function mostrarRegionActiva() {
  const currentHash = window.location.hash;
  if (currentHash) {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    const dropdownItems = document.querySelectorAll(
        ".dropdown-menu .dropdown-item"
    );
    navLinks.forEach((link) => {
        link.classList.remove("active");
    });
    dropdownItems.forEach((item) => {
        item.classList.remove("active");
    }); 
    console.log(dropdownItems.length);
    console.log(navLinks.length);
    
    dropdownItems.forEach((item) => {
        console.log(currentHash);
        
        if (item.getAttribute("href").includes(currentHash) && currentHash !== "") {
            
        // item.classList.add('active');
        // Activar también el botón padre "Categorías"
        const parentDropdownToggle = item
            .closest(".dropdown")
            .querySelector(".nav-link.dropdown-toggle");
        if (parentDropdownToggle) {
            parentDropdownToggle.classList.add("active");
        }
        }
    })
  }
}
