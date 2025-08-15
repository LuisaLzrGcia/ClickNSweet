import {
  getBasePath,
  isActive,
  getCurrentPath,
  resolvePath,
} from "./router.js";
import { isAdmin, isAuthenticated } from "./navbarAuthManager.js";
// import { CartService } from '../services/cart.js';
import { logout } from "../login/auth.js";

const config = {
  categories: [
    "Chocolates",
    "Dulces Frutales",
    "Dulces Picantes",
    "Dulces de caramelo",
    "Dulces Refrescantes",
    "Dulces Salados",
    "Dulces Cremosos",
    "Dulces Especiados",
    "Dulces Ácidos",
  ],
  adminRoutes: [
    {
      path: "../main-manage-products/index.html",
      label: "Administrar productos",
    },
    { path: "../new-product/index.html", label: "Crear producto" },
  ],
};

const navItems = [
  { path: "../", label: "Inicio" },
  { path: "../products/index.html", label: "Productos" },
  {
    type: "dropdown",
    path: "/index.html#categories",
    label: "Categorías",
    items: config.categories.map((cat, index) => ({
      // path: `/#${cat.toLowerCase().replace(/\s+/g, '-')}`,
      path: "../products/index.html?category=" + (index + 1),
      label: cat,
    })),
  },
  { path: "../about/index.html", label: "Quiénes somos" },
  { path: "../contact-us/index.html", label: "Contacto" },
];

function getCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;
  return Math.max(cartCount, 0);
  // if (cartCount > 9) {
  //     cartCountElement.classList.add("cart-badge-big-count");
  //     cartCountElement.innerText = "+9";
  // } else {
  //     cartCountElement.innerText = Math.max(cartCount, 0);
  //     cartCountElement.classList.remove("cart-badge-big-count");
  // }
}

// Plantilla de la barra de navegación
function template() {
  const basePath = getBasePath();
  const currentPath = getCurrentPath();
  const isUserAuthenticated = isAuthenticated();
  const cartCount = getCartCount();

  return `
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="${resolvePath(
              "../"
            )}">
                <img src="${resolvePath("../assets/logotipo-clicknsweet-2.png")}" 
                        alt="Logo" style="height: 40px; margin-right: 8px" />
                <span style="font-family: 'Pacifico', cursive; font-size: 1.8rem">
                    Click N' Sweet
                </span>
            </a>
            <button class="navbar-toggler" type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-xl-center">
                    ${renderNavItems(currentPath, basePath)}
                    ${renderCart(cartCount > 9 ? "+9" : cartCount, basePath)}
                    ${renderAdminItems()}
                    ${renderAuthSection(isUserAuthenticated, basePath)}
                </ul>
            </div>
        </div>`;
}

// Renderiza los ítems de navegación principales
function renderNavItems(currentPath, basePath) {
  return navItems
    .map((item) => {
      if (item.type === "dropdown") {
        return `
            <li class="nav-item dropdown ${isAdmin() ? "d-none" : ""}">
                <a class="nav-link dropdown-toggle btn btn-pink mx-1 
                            ${isActive(item.path) ? "active" : ""}" 
                    data-bs-toggle="dropdown" aria-expanded="false">
                    ${item.label}
                </a>
                <ul class="dropdown-menu">
                    ${item.items
                      .map(
                        (subItem) => `
                        <li>
                            <a class="dropdown-item" 
                                href="${resolvePath(subItem.path)}">
                                ${subItem.label}
                            </a>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </li>`;
      }

      return `
        <li class="nav-item nav-item-user ${isAdmin() ? "d-none" : ""}">
            <a class="nav-link btn btn-pink mx-1 
                        ${isActive(item.path) ? "active" : ""}" 
                href="${resolvePath(item.path)}">
                ${item.label}
            </a>
        </li>`;
    })
    .join("");
}

// Renderiza la sección del carrito
function renderCart(count, basePath) {
  const cartPath = "../cart/index.html";
  return `
    <li class="nav-item ${isAdmin() ? "d-none" : ""}">
        <a class="nav-link btn btn-pink mx-1 position-relative d-flex align-items-center justify-content-center me-3
            ${isActive(cartPath) ? "active" : ""}"
            href="${resolvePath(cartPath)}">
            <span class="cart-icon position-relative me-1">
                🛒
                ${`
                <div id="cart-indicator" class="cart-badge">
                    ${count}
                </div>`}
            </span>
            Carrito
        </a>
    </li>`;
}

// Renderiza la sección de autenticación
function renderAuthSection(isAuthenticated, basePath) {
  if (isAuthenticated) {
    return `
        <li class="nav-item dropdown user-menu">
            <a id="user-icon" class="nav-link dropdown-toggle d-flex align-items-center justify-content-center"
                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i>
            </a>
            ${
              JSON.parse(localStorage.getItem("usuario")).role == "admin"
                ? `
                            <ul class="dropdown-menu dropdown-menu-end">
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item logout" href="${resolvePath(
                  "../"
                )}">Cerrar sesión</a></li>
            </ul>
              `
                : `            
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="${resolvePath(
                  "../account-details/index.html"
                )}">Mi perfil</a></li>
                
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item logout" href="${resolvePath(
                  "../"
                )}">Cerrar sesión</a></li>
            </ul>`
            }
        </li>`;
  }
  const loginPath = "../login/index.html";
  const registerPath = "../form/form.html";
  return `
    <li class="nav-item autenticacion">
        <a class="nav-link btn btn-pink mx-1
            ${isActive(loginPath) ? "active" : ""}" 
            href="${resolvePath(loginPath)}">
            Iniciar Sesión
        </a>
    </li>
    <li class="nav-item autenticacion">
        <a class="nav-link btn btn-register mx-1
            ${isActive(registerPath) ? "active" : ""}" 
            href="${resolvePath(registerPath)}">
            Registro
        </a>
    </li>`;
}

// Renderiza los elementos de administración
function renderAdminItems() {
  return config.adminRoutes
    .map(
      (route) => `
        <li class="nav-item nav-item-admin ${isAdmin() ? "" : "d-none"}">
            <a class="nav-link btn btn-pink mx-1
                ${isActive(route.path) ? "active" : ""}" 
                href="${resolvePath(route.path)}">
                ${route.label}
            </a>
        </li>
    `
    )
    .join("");
}

// Inicializa los componentes de Bootstrap
function initBootstrapComponents() {
  // Inicializar dropdowns
  const dropdowns = document.querySelectorAll(".dropdown-toggle");
  dropdowns.forEach((dropdown) => {
    new bootstrap.Dropdown(dropdown);
  });

  // Inicializar menú colapsable
  const navbarCollapse = document.getElementById("navbarNav");
  if (navbarCollapse) {
    new bootstrap.Collapse(navbarCollapse, {
      toggle: false,
    });
  }
}

// Agrega event listeners
function addEventListeners() {
  // Logout
  document.querySelector(".logout")?.addEventListener("click", (e) => {
    // e.preventDefault();
    logout();
    renderNavBar();
  });
}

// Renderiza la barra completa
export function renderNavBar() {
  const container = document.getElementById("navbar-container");
  const navLinkUser = document.querySelectorAll(".nav-item-user");
  if (!container) return;

  container.innerHTML = template();
  initBootstrapComponents();
  addEventListeners();

  // Mostrar elementos de admin si es necesario
  if (isAdmin()) {
    const adminItems = renderAdminItems();
    const navItems = container.querySelector(".navbar-nav");
    if (navItems) {
      const contactItem = navItems.querySelector(
        '[href$="/contact-us/index.html"]'
      );
      if (contactItem) {
        contactItem.insertAdjacentHTML("afterend", adminItems);
      }
    }
  }
}
