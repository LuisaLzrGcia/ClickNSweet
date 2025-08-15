import { categoriesList } from "../data/categories.js";
import { countries } from "../data/countries.js";
import { products } from "../data/db.js";
import { renderProducts } from "../functions/renderProducts.js";
import { getProductsData } from "./getProductsData.js";

let categoriesApplied = [];
let minPriceApplied = null;
let maxPriceApplied = null;
let countryApplied = null;
let currentPage = 1;

const appliedFiltersBadges = document.getElementById('appliedFiltersBadges');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

document.addEventListener("DOMContentLoaded", function () {
  // Leer filtros desde la URL
  const params = new URLSearchParams(window.location.search);

  if (params.has('category')) categoriesApplied = [params.get('category')];
  if (params.has('country')) countryApplied = params.get('country');
  if (params.has('minPrice')) minPriceApplied = parseFloat(params.get('minPrice'));
  if (params.has('maxPrice')) maxPriceApplied = parseFloat(params.get('maxPrice'));
  if (params.has('page')) currentPage = parseInt(params.get('page'));

  getProducts(currentPage);
  filterProductsByCategory();
  filterProductsByCountries();
  filterProductsByPrice();
  updateFilterBadges();
});

function setFilterParam(key, value) {
  const url = new URL(window.location.href);

  // Si el valor existe y no está vacío, lo agregamos o actualizamos
  if (value !== null && value !== "") {
    url.searchParams.set(key, value);
  } else {
    // Si está vacío o null, eliminamos el parámetro
    url.searchParams.delete(key);
  }

  // Recargar manteniendo los demás parámetros intactos
  window.location.href = url.toString();
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

const getProducts = async (page = 1) => {
  currentPage = page;
  const container = document.getElementById('container-products');
  showLoading();

  try {
    let products = await getProductsData({
      page: currentPage - 1,
      size: 6,
      minPrice: minPriceApplied,
      maxPrice: maxPriceApplied,
      country: countryApplied,
      status: "ACTIVE",
      categoryId: categoriesApplied.length > 0 ? categoriesApplied[0] : null
    });

    let productsArray = products.items;
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

// Ordenamiento (solo frontend)
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

function filterProductsByCategory() {
  renderCategories();
  renderCategoriesMobile();

  document.getElementById('applyCategoryFilter').addEventListener('click', () => {
    categoriesApplied = getSelectedCategories();
    setFilterParam('category', categoriesApplied.length > 0 ? categoriesApplied[0] : null);
  });
}

function renderCategories() {
  let radiosHTML = "<h5>Categorías</h5>";
  categoriesList.forEach(category => {
    const isChecked = categoriesApplied.includes(category) ? 'checked' : '';
    radiosHTML += `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="category-group" value="${category}" id="cat-desktop-${category}" ${isChecked}>
        <label class="form-check-label" for="cat-desktop-${category}">${category}</label>
      </div>
    `;
  });
  document.getElementById('sidebar-categories').innerHTML = radiosHTML;
}

function renderCategoriesMobile() {
  let radiosHTML = "";
  categoriesList.forEach(category => {
    const isChecked = categoriesApplied.includes(category) ? 'checked' : '';
    radiosHTML += `
      <li>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="category-mobile-group" value="${category}" id="cat-mobile-${category}" ${isChecked}>
          <label class="form-check-label" for="cat-mobile-${category}">${category}</label>
        </div>
      </li>
    `;
  });
  const categoryList = document.getElementById('categoryList');
  const applyButtonLI = categoryList.querySelector('li:last-child');
  categoryList.innerHTML = radiosHTML;
  if (applyButtonLI) categoryList.appendChild(applyButtonLI);
  syncCategoryRadios();
}

function syncCategoryRadios() {
  categoriesList.forEach(category => {
    const desktopRadio = document.getElementById(`cat-desktop-${category}`);
    const mobileRadio = document.getElementById(`cat-mobile-${category}`);
    if (desktopRadio && mobileRadio) {
      desktopRadio.addEventListener('change', () => {
        if (desktopRadio.checked) mobileRadio.checked = true;
      });
      mobileRadio.addEventListener('change', () => {
        if (mobileRadio.checked) desktopRadio.checked = true;
      });
    }
  });
}

function getSelectedCategories() {
  const selectedDesktop = document.querySelector('#sidebar-categories input[type="radio"]:checked');
  const selectedMobile = document.querySelector('#categoryList input[type="radio"]:checked');
  const selected = [];
  if (selectedDesktop) selected.push(selectedDesktop.value);
  else if (selectedMobile) selected.push(selectedMobile.value);
  return selected;
}

function filterProductsByCountries() {
  renderCountryOptions();
  renderCountryOptionsMobile();
  document.getElementById("select-country").addEventListener("change", (e) => {
    setFilterParam('country', e.target.value !== "0" ? e.target.value : null);
  });
}

function renderCountryOptions() {
  const countryContainer = document.getElementById("sidebar-countries");
  let countriesOptions = `
    <h6 class="filter-title">País</h6>
    <select class="form-select" id="select-country">
      <option value="0">Todos</option>
      ${countries.map(c => `<option value="${c}" ${countryApplied === c ? 'selected' : ''}>${c}</option>`).join('')}
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
      setFilterParam('country', c);
    });
    countryOptions.appendChild(a);
  });
}

function filterProductsByPrice() {
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const applyBtn = document.getElementById('applyPriceFilter');
  if (minPriceApplied) minPriceInput.value = minPriceApplied;
  if (maxPriceApplied) maxPriceInput.value = maxPriceApplied;

  applyBtn.addEventListener('click', () => {
    setFilterParam('minPrice', minPriceInput.value !== "" ? minPriceInput.value : null);
    setFilterParam('maxPrice', maxPriceInput.value !== "" ? maxPriceInput.value : null);
  });
}

function updateFilterBadges() {
  let badgesHTML = "";
  categoriesApplied.forEach(cat => badgesHTML += `<span class="badge badge-category me-1">${cat}</span>`);
  if (countryApplied) badgesHTML += `<span class="badge badge-country me-1">${countryApplied}</span>`;
  if (minPriceApplied !== null) badgesHTML += `<span class="badge badge-price text-dark me-1">Precio mínimo: ${minPriceApplied}</span>`;
  if (maxPriceApplied !== null) badgesHTML += `<span class="badge badge-price text-dark me-1">Precio máximo: ${maxPriceApplied}</span>`;
  appliedFiltersBadges.innerHTML = badgesHTML;
  clearFiltersBtn.style.display = badgesHTML.trim() ? "inline-block" : "none";
}

clearFiltersBtn.addEventListener('click', () => {
  window.location.href = window.location.pathname; // Limpia filtros
});

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
  container.querySelectorAll(".page-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = parseInt(this.getAttribute("data-page"));
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setFilterParam('page', page);
      }
    });
  });
}
