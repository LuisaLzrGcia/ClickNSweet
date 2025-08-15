import { categoriesList } from "../data/categories.js";
import { countries } from "../data/countries.js";
import { products } from "../data/db.js";
import { renderProducts } from "../functions/renderProducts.js";
import { getProductsData } from "./getProductsData.js";

let categoriesApplied = [];
let minPriceApplied = null;
let maxPriceApplied = null;
let countryApplied = null;
let currentPage = 1; // Página actual en frontend (1-based)

const appliedFiltersBadges = document.getElementById('appliedFiltersBadges');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

document.addEventListener("DOMContentLoaded", function () {



  getProducts(currentPage); // Carga la página inicial
  filterProductsByCategory();
  filterProductsByCountries();
  filterProductsByPrice();
  updateFilterBadges();
});

// Mostrar mensaje de error en pantalla
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

// Mostrar indicador de carga
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

// Función para obtener y renderizar productos con paginación y filtros
const getProducts = async (page = 1) => {
  currentPage = page; // Actualiza página global frontend

  const container = document.getElementById('container-products');
  showLoading();

  const params = new URLSearchParams(window.location.search);
  // Verificar si existe el parámetro 'category'
  let category = 0;
if (params.has('category')) {
  category = parseInt(params.get('category')); // <-- importante
  console.log('Category:', category);
}



  try {
    let products = await getProductsData({
      page: currentPage - 1, // Backend 0-based
      size: 6,
      minPrice: minPriceApplied,
      maxPrice: maxPriceApplied,
      country: countryApplied,
      status: "ACTIVE",
      categoryId: category > 0 ? category : null
    });

    let productsArray = products.items;
    console.log(productsArray);

    if (!productsArray || productsArray.length === 0) {
      container.innerHTML = `<p style="text-align: center;">No hay productos disponibles</p>`;
    } else {
      renderPagination(products.totalPages, currentPage);
      container.innerHTML = renderProducts(productsArray);
    }
  } catch (error) {
    showErrorMessage(error.message);
  }
};

// Eventos de ordenamiento - sin cambios importantes
document.getElementById('sort-new').addEventListener('click', () => {
  renderProducts([...products].reverse());
});

document.getElementById('sort-price-asc').addEventListener('click', () => {
  const sorted = [...products].sort((a, b) => a.price_discount - b.price_discount);
  renderProducts(sorted);
});

document.getElementById('sort-price-desc').addEventListener('click', () => {
  const sorted = [...products].sort((a, b) => b.price_discount - a.price_discount);
  renderProducts(sorted);
});

document.getElementById('sort-rating').addEventListener('click', () => {
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  renderProducts(sorted);
});

// Funciones para filtros (categorías, países y precio) y sincronización
function filterProductsByCategory() {
  renderCategories();
  renderCategoriesMobile();

  document.getElementById('applyCategoryFilter').addEventListener('click', () => {
    categoriesApplied = getSelectedCategories();
    const dropdownToggle = document.querySelector('#dropdownFilterCategories > button');
    bootstrap.Dropdown.getInstance(dropdownToggle).hide();
    updateFilterBadges();
    logAppliedFilters();
    getProducts(1); // Reinicia paginación al aplicar filtro
  });
}

function renderCategories() {
  let checkboxesHTML = "<h5>Categorías</h5>";
  categoriesList.forEach(category => {
    const isChecked = categoriesApplied.includes(category) ? 'checked' : '';
    checkboxesHTML += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="${category}" id="cat-desktop-${category}" ${isChecked}>
        <label class="form-check-label" for="cat-desktop-${category}">${category}</label>
      </div>
    `;
  });
  document.getElementById('sidebar-categories').innerHTML = checkboxesHTML;

  syncCategoryCheckboxes();
}

function renderCategoriesMobile() {
  let checkboxesHTML = "";
  categoriesList.forEach(category => {
    const isChecked = categoriesApplied.includes(category) ? 'checked' : '';
    checkboxesHTML += `
      <li>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${category}" id="cat-mobile-${category}" ${isChecked}>
          <label class="form-check-label" for="cat-mobile-${category}">${category}</label>
        </div>
      </li>
    `;
  });
  const categoryList = document.getElementById('categoryList');
  const applyButtonLI = categoryList.querySelector('li:last-child');
  categoryList.innerHTML = checkboxesHTML;
  if (applyButtonLI) categoryList.appendChild(applyButtonLI);

  syncCategoryCheckboxes();
}

function syncCategoryCheckboxes() {
  categoriesList.forEach(category => {
    const desktopCheckbox = document.getElementById(`cat-desktop-${category}`);
    const mobileCheckbox = document.getElementById(`cat-mobile-${category}`);

    if (desktopCheckbox && mobileCheckbox) {
      desktopCheckbox.addEventListener('change', () => {
        mobileCheckbox.checked = desktopCheckbox.checked;
        updateCategoriesApplied();
      });

      mobileCheckbox.addEventListener('change', () => {
        desktopCheckbox.checked = mobileCheckbox.checked;
        updateCategoriesApplied();
      });
    }
  });
}

function updateCategoriesApplied() {
  categoriesApplied = getSelectedCategories();
  updateFilterBadges();
  logAppliedFilters();
}

function getSelectedCategories() {
  const desktopCheckboxes = document.querySelectorAll('#sidebar-categories input[type="checkbox"]');
  const mobileCheckboxes = document.querySelectorAll('#categoryList input[type="checkbox"]');
  const selected = [];

  desktopCheckboxes.forEach((checkbox, i) => {
    const mobileCheckbox = mobileCheckboxes[i];
    if (checkbox.checked || mobileCheckbox.checked) {
      selected.push(checkbox.value);
      checkbox.checked = true;
      mobileCheckbox.checked = true;
    } else {
      checkbox.checked = false;
      mobileCheckbox.checked = false;
    }
  });

  return selected;
}

function filterProductsByCountries() {
  const dropdownButton = document.getElementById("dropdownButton");
  const countrySearch = document.getElementById("countrySearch");
  const countryOptions = document.getElementById("countryOptions");

  countrySearch.addEventListener("input", (e) => {
    renderCountryOptionsMobile(e.target.value);
  });

  renderCountryOptions();
  renderCountryOptionsMobile();

  const dropdown = new bootstrap.Dropdown(dropdownButton);

  document.getElementById("select-country").addEventListener("change", (e) => {
    countryApplied = e.target.value !== "0" ? e.target.value : null;
    updateFilterBadges();
    logAppliedFilters();
    getProducts(1); // Reinicia paginación al cambiar país
  });
}

function renderCountryOptions() {
  const countryContainer = document.getElementById("sidebar-countries");

  let countriesOptions = `
    <h6 class="filter-title">País</h6>
    <select class="form-select" id="select-country">
      <option selected value="0">Todos</option>
      ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
    </select>
  `;

  countryContainer.innerHTML = countriesOptions;
}

function renderCountryOptionsMobile(filter = "") {
  const countryOptions = document.getElementById("countryOptions");
  countryOptions.innerHTML = "";
  const filtered = countries.filter(c => c.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    countryOptions.innerHTML = `<div class="dropdown-item disabled">No se encontraron países</div>`;
    return;
  }

  filtered.forEach(c => {
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#";
    a.textContent = c;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("dropdownButton").textContent = c;
      countryApplied = c;
      document.getElementById("countrySearch").value = "";
      renderCountryOptions();
      bootstrap.Dropdown.getInstance(document.getElementById("dropdownButton")).hide();
      updateFilterBadges();
      logAppliedFilters();
      getProducts(1); // Reinicia paginación al seleccionar país móvil
    });
    countryOptions.appendChild(a);
  });
}

function filterProductsByPrice() {
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const applyBtn = document.getElementById('applyPriceFilter');

  applyBtn.addEventListener('click', () => {
    minPriceApplied = minPriceInput.value !== "" ? parseFloat(minPriceInput.value) : null;
    maxPriceApplied = maxPriceInput.value !== "" ? parseFloat(maxPriceInput.value) : null;
    updateFilterBadges();
    logAppliedFilters();
    getProducts(1); // Reinicia paginación al aplicar filtro de precio
  });
}

function updateFilterBadges() {
  let badgesHTML = "";

  categoriesApplied.forEach(cat => {
    badgesHTML += `<span class="badge badge-category me-1">${cat}</span>`;
  });

  if (countryApplied) {
    badgesHTML += `<span class="badge badge-country me-1">${countryApplied}</span>`;
  }

  if (minPriceApplied !== null) {
    badgesHTML += `<span class="badge badge-price text-dark me-1">Precio mínimo: ${minPriceApplied}</span>`;
  }

  if (maxPriceApplied !== null) {
    badgesHTML += `<span class="badge badge-price text-dark me-1">Precio máximo: ${maxPriceApplied}</span>`;
  }

  appliedFiltersBadges.innerHTML = badgesHTML;
  clearFiltersBtn.style.display = badgesHTML.trim() ? "inline-block" : "none";
}

clearFiltersBtn.addEventListener('click', () => {
  // Reset categorías
  document.querySelectorAll('#categoryList input[type="checkbox"], #sidebar-categories input[type="checkbox"]').forEach(cb => cb.checked = false);
  categoriesApplied = [];

  // Reset país
  countryApplied = null;
  document.getElementById("dropdownButton").textContent = "País";
  renderCountryOptions();

  // Reset precio
  minPriceApplied = null;
  maxPriceApplied = null;
  document.getElementById('minPrice').value = "";
  document.getElementById('maxPrice').value = "";

  updateFilterBadges();
  logAppliedFilters();
  getProducts(1); // Reinicia paginación al limpiar filtros
});

function logAppliedFilters() {
  const filters = {
    categorías: categoriesApplied.length > 0 ? categoriesApplied : null,
    país: countryApplied || null,
    precio_min: minPriceApplied,
    precio_max: maxPriceApplied
  };
  console.log("Filtros aplicados:", filters);
}

function renderPagination(totalPages, currentPage = 1) {
  const container = document.getElementById("pagination-container");

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

  // Asignar eventos para cambio de página
  container.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.getAttribute("data-page"));

      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        currentPage = page; // Actualiza página actual frontend
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll arriba con animación
        getProducts(currentPage); // Recarga productos con la página seleccionada
      }
    });
  });
}

