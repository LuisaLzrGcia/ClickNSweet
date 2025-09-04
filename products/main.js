import { countries } from "../data/countries.js";
import { products } from "../data/db.js";
import { getCategoriesData } from "../fetchData/getCategoriesData.js";
import { getCountriesData } from "../fetchData/getCountriesData.js";
import { renderProducts } from "../functions/renderProducts.js";
import { getProductsData } from "./getProductsData.js";

const clearFiltersBtn = document.getElementById('clearFiltersBtn');

document.querySelectorAll(".btn-apply-filter").forEach(boton => {
  boton.addEventListener("click", () => {
    applyFiltersProducts()
  });
});

document.addEventListener("DOMContentLoaded", async function () {
  // Verificar si existe el parámetro "page"
  const url = new URL(window.location.href);
  let page = url.searchParams.get("page");

  // Si no existe el parámetro page o si es 0, lo forzamos a 1
  if (!page || page === "0") {
    url.searchParams.set("page", "1");
    history.replaceState(null, "", url.toString());
  }

  // Renderizar filtros primero
  await renderCategories();
  await renderCountries();

  // Hidratar filtros desde URL
  hydrateFiltersFromURL();

  // Obtener página actual desde URL o 1
  const params = new URLSearchParams(window.location.search);

  // Obtener productos
  getProducts();

  // Eventos
  clearFiltersBtn.addEventListener('click', () => {
    clearAllFiltersKeepPageOne();
  });
});

function hydrateFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  // Categoría
  const category = params.get("category");
  if (category) {
    const radio = document.querySelector(
      `input[name="category-group"][value="${category}"]`
    );
    if (radio) radio.checked = true;
  }

  // País
  const country = params.get("country");
  const select = document.getElementById("select-country");
  if (select && country) {
    select.value = country;
  }

  // Precios
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  if (minPrice) document.getElementById("minPrice").value = minPrice;
  if (maxPrice) document.getElementById("maxPrice").value = maxPrice;

  // ---------------- Orden (botones) ----------------
  const sortBy = params.get("sort-by"); // popular, new, price, rating, etc.

  const sortButtons = [
    { id: "sort-popular", value: "popular" },
    { id: "sort-new", value: "new" },
    { id: "sort-price-asc", value: "price-asc" },
    { id: "sort-price-desc", value: "price-desc" },
    { id: "sort-rating", value: "rating" }
  ];

  sortButtons.forEach(btn => {
    const element = document.getElementById(btn.id);
    if (!element) return;

    if (sortBy === btn.value || (!sortBy && btn.value === "popular")) {
      // si coincide con el parámetro o no hay parámetro → btn-dark
      element.classList.add("btn-dark");
      element.classList.remove("btn-outline-secondary");
    } else {
      // los demás → btn-outline-secondary
      element.classList.remove("btn-dark");
      element.classList.add("btn-outline-secondary");
    }
  });
}

function applyFiltersProducts() {
  // Tomar todos los parámetros actuales
  const params = new URLSearchParams(window.location.search);

  // Page siempre inicia en 1 al aplicar filtros
  params.set("page", 1);

  const category = getSelectedCategory();
  const country = getSelectedCountry();
  const minPrice = getMinPrice();
  const maxPrice = getMaxPrice();

  // Actualizar parámetros
  if (category) params.set("category", category);
  else params.delete("category");

  if (country && country !== "0" && country !== "Todos") params.set("country", country);
  else params.delete("country");

  if (minPrice && minPrice !== "0") params.set("minPrice", minPrice);
  else params.delete("minPrice");

  if (maxPrice && maxPrice !== "0") params.set("maxPrice", maxPrice);
  else params.delete("maxPrice");

  // ----------------- Marcar solo Populares -----------------
  const sortButtons = [
    "sort-popular",
    "sort-new",
    "sort-price-asc",
    "sort-price-desc",
    "sort-rating"
  ];

  sortButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    if (id === "sort-popular") {
      btn.classList.add("btn-dark");
      btn.classList.remove("btn-outline-secondary");
    } else {
      btn.classList.remove("btn-dark");
      btn.classList.add("btn-outline-secondary");
    }
  });

  // Actualizar la URL sin recargar
  history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);

  // Obtener productos con los filtros actualizados
  getProducts(1);
}



function getSelectedCategory() {
  const selected = document.querySelector('input[name="category-group"]:checked');
  if (selected) {
    return selected.value; // aquí regresa el nombre de la categoría
  }
  return null; // si no hay nada seleccionado

}

function getSelectedCountry() {
  const select = document.getElementById("select-country");
  if (select) {
    const selectedOption = select.options[select.selectedIndex]; // opción seleccionada
    return selectedOption.text; // devuelve el texto visible del option
  }
  return null;
}

function getMinPrice() {
  const minPriceInput = document.getElementById('minPrice');
  return minPriceInput && minPriceInput.value ? minPriceInput.value : 0;
}

function getMaxPrice() {
  const maxPriceInput = document.getElementById('maxPrice');
  return maxPriceInput && maxPriceInput.value ? maxPriceInput.value : 0;
}

async function renderCategories() {
  let radiosHTML = "";

  const urlParams = new URLSearchParams(window.location.search);
  const appliedCategory = urlParams.get("category");

  try {
    const categoriesList = await getCategoriesData('GET');

    categoriesList.forEach(category => {
      const isChecked = appliedCategory === category.name ? 'checked' : '';
      // Desktop
      radiosHTML += `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="category-group" value="${category.name}" id="cat-desktop-${category.id}" ${isChecked}>
          <label class="form-check-label" for="cat-desktop-${category.id}">${category.name}</label>
        </div>
      `;
    });

    document.getElementById('sidebar-categories').innerHTML = `<h5>Categorías</h5>${radiosHTML}`;

    // Mobile
    let mobileHTML = categoriesList.map(category => {
      const isChecked = appliedCategory === category.name ? 'checked' : '';
      return `
        <li>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="category-group-mobile" value="${category.name}" id="cat-mobile-${category.id}" ${isChecked}>
            <label class="form-check-label" for="cat-mobile-${category.id}">${category.name}</label>
          </div>
        </li>
      `;
    }).join('');
    document.getElementById('categoryList').innerHTML = mobileHTML + `
    `;

  } catch (error) {
    document.getElementById('sidebar-categories').innerHTML = `<p class="text-danger">❌ Error al cargar las categorías.</p>`;
  }
}

async function renderCountries() {
  const countryContainer = document.getElementById("sidebar-countries");
  const mobileContainer = document.getElementById("countryOptions");

  try {
    const countriesList = await getCountriesData();
    const urlParams = new URLSearchParams(window.location.search);
    const appliedCountry = urlParams.get("country") || "0";

    console.log(appliedCountry);

    // Desktop
    let countriesOptions = `
      <h6 class="filter-title">País</h6>
      <select class="form-select" id="select-country" data-filter="country">
        <option value="0" ${appliedCountry === "0" ? "selected" : ""}>Todos</option>
        ${countriesList.map(c => `<option value="${c.name}" ${appliedCountry === c.name ? "selected" : ""}>${c.name}</option>`).join('')}
      </select>
    `;
    countryContainer.innerHTML = countriesOptions;

    // // Mobile
    // let mobileOptions = countriesList.map((c, index) => {
    //   const selected = appliedCountry === c.name ? "checked" : "";
    //   const inputId = `country-mobile-${index}`;
    //   return `
    //     <div class="form-check">
    //       <input type="radio" class="form-check-input" name="country-mobile" value="${c.name}" id="${inputId}" ${selected}>
    //       <label class="form-check-label" for="${inputId}">${c.name}</label>
    //     </div>
    //   `;
    // }).join('');

    // // Render con scroll y botón aplicar filtro
    // mobileContainer.innerHTML = `
    //   <div style="height: auto; overflow-y: auto;">
    //     ${mobileOptions}
    //   </div>
    // `;

    // // Evento botón aplicar filtro
    // document.getElementById('applyMobileCountryFilter').addEventListener('click', () => {
    //   const selectedRadio = document.querySelector('input[name="country-mobile"]:checked');
    //   const selectedCountry = selectedRadio ? selectedRadio.value : null;

    //   const urlParams = new URLSearchParams(window.location.search);
    //   urlParams.set("page", 1);

    //   if (selectedCountry && selectedCountry !== "0" && selectedCountry !== "Todos") {
    //     urlParams.set("country", selectedCountry);
    //   } else {
    //     urlParams.delete("country");
    //   }

    //   history.replaceState(null, "", `${window.location.pathname}?${urlParams.toString()}`);
    //   getProducts(); // Llama a tu función para actualizar productos
    // });

  } catch (error) {
    console.error("Error al renderizar países:", error);
    countryContainer.innerHTML = `<p class="text-danger">❌ Error al cargar los países.</p>`;
  }
}


document.querySelectorAll(".btn-apply-filter-clean").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = new URL(window.location);
    if ([...url.searchParams].length > 0) { // Verifica si hay parámetros
      url.search = ""; // Limpia todos los parámetros
      window.location.href = url; // Recarga la página sin parámetros
    }
  });
});



function showErrorMessage(message) {
  const container = document.getElementById('container-products');
  container.innerHTML = `
    <div class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
      </svg>
      <span class="ms-1">${message}</span>
    </div>
  `;
}

function showLoading() {
  const container = document.getElementById('container-products');
  container.innerHTML = `
    <div class="loading-indicator">
      <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
      </svg>
      <span class="ms-1">Cargando productos...</span>
    </div>
  `;
}

let loadedProducts = []; // aquí guardamos lo que viene de la API

const getProducts = async () => {
  const container = document.getElementById('container-products');
  showLoading();

  // Obtener filtros actuales desde la URL
  const params = new URLSearchParams(window.location.search);
  const currentPage = parseInt(params.get('page')) || 1;
  const category = params.get('category');
  const minPrice = params.get('minPrice') ? parseFloat(params.get('minPrice')) : null;
  const maxPrice = params.get('maxPrice') ? parseFloat(params.get('maxPrice')) : null;
  const country = params.get('country');
  const orderBy = params.get('sort-by');
  const sort = params.get('sort');
  const search = params.get('search');

  try {
    const products = await getProductsData({
      page: currentPage - 1,
      size: 6,
      minPrice,
      maxPrice,
      country,
      status: "ACTIVE",
      category,
      orderBy,
      sort,
      search
    });

    loadedProducts = products.items; // guardamos los productos

    if (!loadedProducts || loadedProducts.length === 0) {
      container.innerHTML = `
        <p style="
          text-align: center; 
          font-size: 2rem; 
          font-weight: bold; 
          padding: 3rem;
        ">
          No hay productos disponibles
        </p>
      `;
    } else {
      renderPagination(products.totalPages, currentPage);
      container.innerHTML = renderProducts(loadedProducts);
    }
  } catch (error) {
    showErrorMessage(error.message);
  }
};


const sortButtons = document.querySelectorAll(
  "#sort-popular, #sort-new, #sort-price-asc, #sort-price-desc, #sort-rating"
);

// Función para resetear estilos
function resetButtons() {
  sortButtons.forEach((btn) => {
    btn.classList.remove("btn-dark");
    btn.classList.add("btn-outline-secondary");
  });
}

// ---- Funciones separadas para cada botón ----
function updateUrl(params) {
  const newUrl = window.location.pathname + "?" + params.toString();
  window.history.replaceState({}, "", newUrl);
  getProducts()
}

// Popular → sin parámetros
function handlePopularClick() {
  resetButtons();
  document.getElementById("sort-popular").classList.add("btn-dark");

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete("sort-by");
  urlParams.delete("sort");

  updateUrl(urlParams);
}

// New → sort-by=new
function handleNewClick() {
  resetButtons();
  document.getElementById("sort-new").classList.add("btn-dark");

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort-by", "new");
  urlParams.delete("sort"); // opcional si no necesitas sort en este caso

  updateUrl(urlParams);
}

// Precio Asc → sort-by=price, sort=asc
function handlePriceAscClick() {
  resetButtons();
  document.getElementById("sort-price-asc").classList.add("btn-dark");

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort-by", "price");
  urlParams.set("sort", "asc");

  updateUrl(urlParams);
}

// Precio Desc → sort-by=price, sort=desc
function handlePriceDescClick() {
  resetButtons();
  document.getElementById("sort-price-desc").classList.add("btn-dark");

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort-by", "price");
  urlParams.set("sort", "desc");

  updateUrl(urlParams);
}

// Rating → sort-by=rating
function handleRatingClick() {
  resetButtons();
  document.getElementById("sort-rating").classList.add("btn-dark");

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort-by", "rating");
  urlParams.delete("sort"); // solo "sort-by" es suficiente aquí

  updateUrl(urlParams);
}

// ---- Asignar event listeners ----
document.getElementById("sort-popular").addEventListener("click", handlePopularClick);
document.getElementById("sort-new").addEventListener("click", handleNewClick);
document.getElementById("sort-price-asc").addEventListener("click", handlePriceAscClick);
document.getElementById("sort-price-desc").addEventListener("click", handlePriceDescClick);
document.getElementById("sort-rating").addEventListener("click", handleRatingClick);



function renderPagination(totalPages) {
  const container = document.getElementById("pagination-container");

  // Obtener el parámetro page desde la URL, si no existe, por defecto 1
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("page")) || 1;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  let html = `
    <ul class="pagination justify-content-center">
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
      </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  html += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
      </li>
    </ul>
  `;

  container.innerHTML = html;

  container.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.getAttribute("data-page"));
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        // Actualizar parámetro page en la URL
        urlParams.set("page", page);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.replaceState(null, "", newUrl);

        // Llamar a la función que obtiene productos para la nueva página
        getProducts(page);

        // Volver al principio de la página
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Volver a renderizar la paginación para actualizar la página activa
        renderPagination(totalPages);
      }
    });
  });
}



// ----- Boton atras/adelante para que se actualicen productos y filtros visibles --- PARTE DE LAS ULTIMAS MODIFICACIONES ------ //
window.addEventListener("popstate", () => {
  hydrateFiltersFromURL();
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page")) || 1;
  getProducts(page);
});


// Botón de búsqueda
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const clearSearchButton = document.getElementById("clear-search-button");

// --- Inicializar input desde URL ---
const urlParams = new URLSearchParams(window.location.search);
const searchParam = urlParams.get("search");

if (searchParam) {
  searchInput.value = searchParam;
  clearSearchButton.classList.remove("d-none");
  searchButton.classList.add("d-none");
} else {
  clearSearchButton.classList.add("d-none");
  searchButton.classList.remove("d-none");
}

// --- Evento click en buscar ---
searchButton.addEventListener("click", () => {
  searchProduct()
});

// Solo ejecutar búsqueda cuando se presiona Enter
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // evita que recargue el form si está dentro de un <form>
    searchProduct();
  }
});


function searchProduct() {
  const query = searchInput.value.trim();
  const urlParams = new URLSearchParams(window.location.search);

  if (query) {
    urlParams.set("search", query);
    clearSearchButton.classList.remove("d-none");
    searchButton.classList.add("d-none");
  } else {
    urlParams.delete("search");
    clearSearchButton.classList.add("d-none");
    searchButton.classList.remove("d-none");
  }

  urlParams.set("page", 1);
  history.replaceState(null, "", `${window.location.pathname}?${urlParams.toString()}`);
  getProducts();
}

// --- Evento click en limpiar búsqueda ---
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete("search");
  urlParams.set("page", 1);
  history.replaceState(null, "", `${window.location.pathname}?${urlParams.toString()}`);
  clearSearchButton.classList.add("d-none");
  searchButton.classList.remove("d-none");
  getProducts();
});

