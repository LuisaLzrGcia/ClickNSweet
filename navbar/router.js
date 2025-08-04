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
    const current = getCurrentPath().replace(/\/$/, '');
    const compare = path.replace(/\/$/, '');
    return current === compare || current === `${compare}/index.html`;
}
