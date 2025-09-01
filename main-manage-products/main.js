// ---- Actualización al main de la vista del admin --- PARTE DE LOS ULTIMOS CAMBIOS --- //

import fetchData from "../fetchData/fetchData.js";
import { renderDashboardProducts } from "./renderDashboardProducts.js";
import { setupDeleteButtons } from "./setupDeleteButton.js";
import { setupEditButtons } from "./setupEditButtons.js";
import { switchControl } from "./switchControl.js";
import { renderStars } from "../functions/renderStars.js";

let products = [];
let currentPage = 1;
let totalPages = 1;

// Adaptador: BackEnd -> UI
function adaptProductForUI(p) {
  const price = Number(p.price ?? p.pricing ?? 0);
  const discountVal = Number(p.discountValue ?? p.discount ?? 0);
  const priceDiscount = discountVal ? price * (1 - discountVal / 100) : price;
  const ratingRaw = p.averageRating ?? p.avgRating ?? p.rating ?? p.stars ?? p.score ?? 0;
  const rating = Math.max(0, Math.min(5, Number(ratingRaw)));

  return {
    id: p.id ?? p.productId,
    name: p.productName ?? p.name ?? "—",
    pricing: price,
    discount: discountVal,
    price_discount: priceDiscount,
    rating,
    picture: p.picture ?? "",
    image: p.image ?? null,
    imageMimeType: p.imageMimeType ?? p.imageType ?? "image/jpeg",
    category: p.productCategoryId?.name ?? p.category?.name ?? "—",
    country: p.productCountryId?.name ?? p.country ?? "—",
    stock: (p.quantityStock ?? null) !== null ? Number(p.quantityStock) > 0 : !!(p.status ?? true),
    status: p.status ? "" : "inactive",
    description: p.description ?? "",
  };
}

// Render productos + paginación
function renderList(list, totalPages = 1, currentPage = 1) {
  const container = document.getElementById("dashboard-products");
  if (!container) return;
  container.innerHTML = renderDashboardProducts(list);

  switchControl();
  setupEditButtons();
  setupDeleteButtons();

  renderPagination(totalPages, currentPage);
}

// Paginación UI
function renderPagination(total, current = 1) {
  const container = document.getElementById("pagination-container");
  if (!container) return;

  let html = `
    <ul class="pagination justify-content-center">
      <li class="page-item ${current === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${current - 1}">Anterior</a>
      </li>
  `;

  for (let i = 1; i <= total; i++) {
    html += `
      <li class="page-item ${current === i ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  html += `
      <li class="page-item ${current === total ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${current + 1}">Siguiente</a>
      </li>
    </ul>
  `;

  container.innerHTML = html;
  container.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.getAttribute("data-page"));
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        getProducts(page);
      }
    });
  });
}

/* Carga desde BackEnd
const getProducts = async (page = 1) => {
  const container = document.getElementById("dashboard-products");
  if (!container) return;

  try {
    const body = { page: page - 1, size: 6 }; 
    const resp = await fetchData("/products", "POST", {}, body);
    const arr = Array.isArray(resp?.items) ? resp.items : Array.isArray(resp) ? resp : [];

    products = arr.map(adaptProductForUI);
    totalPages = resp.totalPages ?? 1;
    currentPage = page;

    renderList(products, totalPages, currentPage);
    console.log(products);
  } catch (err) {
    console.error("Error cargando productos:", err);
    container.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
  }
};
*/

// ----------------------- PARTE DE LOS ULTIMOS CAMBIOS -------------------------- //
// Carga dinámica de filtros
async function loadFilters() {
  const categories = await fetchData("/categories", "GET");
  const countries = await fetchData("/countries", "GET");

  const selected = getUrlParams();

  // Render categorías
  const catContainer = document.getElementById("category-filters");
  catContainer.innerHTML = categories.map(cat => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" name="category" value="${cat.id}" id="cat-${cat.id}" ${selected.category?.includes(cat.id.toString()) ? "checked" : ""}>
      <label class="form-check-label" for="cat-${cat.id}">${cat.name}</label>
    </div>
  `).join("");

  // Render países
  const countryContainer = document.getElementById("country-filters");
  countryContainer.innerHTML = `
    <select id="country-select" class="form-select">
      <option value="">Todos</option>
      ${countries.map(c => `
        <option value="${c.code}" ${selected.country?.includes(c.code) ? "selected" : ""}>${c.name}</option>
      `).join("")}
    </select>
  `;

  // Prellenar precio si viene en la URL
  document.getElementById("price-min").value = selected.price_min ?? "";
  document.getElementById("price-max").value = selected.price_max ?? "";
}

// Obtener parámetros URL como objeto
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: Number(params.get("page") ?? 1),
    category: params.getAll("category"),
    country: params.get("country") ? [params.get("country")] : [], // ← importante: devuelvo array
    price_min: params.get("price_min"),
    price_max: params.get("price_max")
  };
}


/* Aplicar filtros y recargar
function applyFilters() {
  const params = new URLSearchParams();
  params.set("page", "1"); // Reiniciar a página 1

  document.querySelectorAll("input[name='category']:checked").forEach(cb => {
    params.append("category", cb.value);
  });
  document.querySelectorAll("input[name='country']:checked").forEach(cb => {
    params.append("country", cb.value);
  });

  const priceMin = document.getElementById("price-min").value;
  const priceMax = document.getElementById("price-max").value;
  if (priceMin) params.set("price_min", priceMin);
  if (priceMax) params.set("price_max", priceMax);

  // Redirige con nueva URL
  window.location.search = params.toString();
}
*/

// ------------------ PARTE DE LOS ULTIMOS CAMBIOS ------------------- //
function applyFilters() {
  const params = new URLSearchParams();
  params.set("page", "1"); // Siempre reinicia a la página 1

  // Categorías
  const selectedCategories = Array.from(document.querySelectorAll("input[name='category']:checked"))
    .map(cb => cb.value);
  selectedCategories.forEach(val => params.append("category", val));

  // Países (select único)
  const countrySelect = document.getElementById("country-select");
  if (countrySelect && countrySelect.value) {
    params.set("country", countrySelect.value);
  }

  // Precio mínimo y máximo
  const priceMin = document.getElementById("price-min")?.value;
  const priceMax = document.getElementById("price-max")?.value;
  if (priceMin) params.set("price_min", priceMin);
  if (priceMax) params.set("price_max", priceMax);

  // Redirigir con solo los parámetros útiles
  window.location.search = params.toString();
}


// Limpiar filtros y redirigir
function applyPriceFilterClean() {
  window.location.search = "page=1";
}

// Adaptar filtros al body del fetch
function getFilterPayload() {
  const { category, country, price_min, price_max } = getUrlParams();

  const payload = {
    page: (getUrlParams().page ?? 1) - 1,
    size: 6,
    filters: {}
  };

  if (category.length) payload.filters.categoryIds = category.map(Number);
  if (country.length) payload.filters.countryCodes = country;
  if (price_min) payload.filters.priceMin = Number(price_min);
  if (price_max) payload.filters.priceMax = Number(price_max);

  return payload;
}

/* Actualiza el fetch de productos:
const getProducts = async () => {
  const container = document.getElementById("dashboard-products");
  if (!container) return;

  const payload = getFilterPayload();

  try {
    const resp = await fetchData("/products", "POST", {}, payload);
    const arr = Array.isArray(resp?.items) ? resp.items : [];
    products = arr.map(adaptProductForUI);
    totalPages = resp.totalPages ?? 1;
    currentPage = payload.page + 1;

    renderList(products, totalPages, currentPage);
  } catch (err) {
    console.error("Error cargando productos:", err);
    container.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
  }
};
*/

const getProducts = async (page = null) => {
  const container = document.getElementById("dashboard-products");
  if (!container) return;

  const urlParams = getUrlParams();
  const payload = getFilterPayload();

  // Si se pasa un nuevo número de página manualmente (desde paginación), actualizamos el payload y la URL
  if (page !== null) {
    payload.page = page - 1;
    urlParams.page = page;

    /* Actualiza la URL manteniendo filtros
    const newParams = new URLSearchParams(urlParams).toString();
    window.history.replaceState({}, "", `?${newParams}`);
    */
  }

  // ----------- PARTE DE LOS ULTIMOS CAMBIOS ------------ //
  const cleanedParams = new URLSearchParams();

  if (urlParams.page) cleanedParams.set("page", urlParams.page);
  if (urlParams.category && urlParams.category.length > 0) {
    urlParams.category.forEach(val => cleanedParams.append("category", val));
  }
  if (urlParams.country && urlParams.country.length > 0) {
    urlParams.country.forEach(val => cleanedParams.append("country", val));
  }
  if (urlParams.price_min && urlParams.price_min !== "null") cleanedParams.set("price_min", urlParams.price_min);
  if (urlParams.price_max && urlParams.price_max !== "null") cleanedParams.set("price_max", urlParams.price_max);

  window.history.replaceState({}, "", `?${cleanedParams.toString()}`);


  try {
    const resp = await fetchData("/products", "POST", {}, payload);
    const arr = Array.isArray(resp?.items) ? resp.items : [];
    products = arr.map(adaptProductForUI);
    totalPages = resp.totalPages ?? 1;
    currentPage = (page !== null) ? page : (urlParams.page ?? 1);

    renderList(products, totalPages, currentPage);
  } catch (err) {
    console.error("Error cargando productos:", err);
    container.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
  }
};


document.addEventListener("DOMContentLoaded", () => {
  loadFilters();
  getProducts(); // Esto tomará la página de la URL

  document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);
  document.getElementById("applyPriceFilterClean")?.addEventListener("click", applyPriceFilterClean);
});




/* -------------- RESPALDO DEL MAIN ANTERIOR PARA VISTA DE ADMIN ---------------------------
import fetchData from "../fetchData/fetchData.js";
import { renderDashboardProducts } from "./renderDashboardProducts.js";
import { setupDeleteButtons } from "./setupDeleteButton.js";
import { setupEditButtons } from "./setupEditButtons.js";
import { switchControl } from "./switchControl.js";
import { renderStars } from "../functions/renderStars.js";


let products = []; // ahora esta lista viene del BackEnd

document.addEventListener("DOMContentLoaded", function () {
  getProducts();           // carga inicial
  // Los siguientes se re-enganchan después de cada render (ver renderList)
  console.log("Cargando productos desde el BackEnd…");
});

// ---------- Adaptador: BackEnd -> UI ----------
function adaptProductForUI(p) {
  const price = Number(p.price ?? p.pricing ?? 0);
  const discountVal = Number(p.discountValue ?? p.discount ?? 0);
  const priceDiscount = discountVal ? price * (1 - discountVal / 100) : price;
  const ratingRaw = p.averageRating ?? p.avgRating ?? p.rating ?? p.stars ?? p.score ?? 0;
  const rating = Math.max(0, Math.min(5, Number(ratingRaw)));

  return {
    id: p.id ?? p.productId,
    name: p.productName ?? p.name ?? "—",
    pricing: price,                    // tu UI usa 'pricing'
    discount: discountVal,             // tu UI espera porcentaje
    price_discount: priceDiscount,     // tu UI usa 'price_discount'
    rating,
    picture: p.picture ?? "",
    image: p.image ?? null,                            // <- base64 desde el back (byte[])
    imageMimeType: p.imageMimeType ?? p.imageType ?? "image/jpeg",

    category: p.productCategoryId?.name ?? p.category?.name ?? "—",
    country: p.productCountryId?.name ?? p.country ?? "—",

    // ‘stock’ es boolean en tu UI; si tienes quantityStock úsalo, si no, deriva de status
    stock: (p.quantityStock ?? null) !== null ? Number(p.quantityStock) > 0 : !!(p.status ?? true),

    // ‘status’ en tu UI es string: "" (activo) o "inactive"
    status: p.status ? "" : "inactive",

    description: p.description ?? "",
  };
}

// ---------- Render helper (pinta y re-engancha handlers) ----------
function renderList(list) {
  const container = document.getElementById("dashboard-products");
  if (!container) return;
  container.innerHTML = renderDashboardProducts(list);

  // Re-enganchar porque el DOM se reemplaza en cada render:
  switchControl();
  setupEditButtons();
  setupDeleteButtons();
}

// ---------- Carga desde BackEnd (POST /products o GET /products) ----------
const getProducts = async () => {
  const container = document.getElementById("dashboard-products");
  if (!container) return;

  try {
    // Preferimos POST /products (paginado). 
    const body = { page: 0, size: 50 };
    const resp = await fetchData("/products", "POST", {}, body);
    const arr = Array.isArray(resp?.items) ? resp.items : Array.isArray(resp) ? resp : [];
    products = arr.map(adaptProductForUI);
  } catch {
    try {
      const list = await fetchData("/products", "GET");
      products = (Array.isArray(list) ? list : []).map(adaptProductForUI);
    } catch (err) {
      console.error("Error cargando productos:", err);
      container.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
      return;
    }
  }

  renderList(products);
  console.log(products);
};

// ---------- Ordenamientos  ----------
document.getElementById("sort-new")?.addEventListener("click", () => {
  renderList([...products].reverse());
});

document.getElementById("sort-price-asc")?.addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => a.price_discount - b.price_discount);
  renderList(sorted);
});

document.getElementById("sort-price-desc")?.addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => b.price_discount - a.price_discount);
  renderList(sorted);
});

document.getElementById("sort-rating")?.addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  renderList(sorted);
});
*/