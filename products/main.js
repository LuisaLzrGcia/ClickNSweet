import { categoriesList } from "../data/categories.js";
import { countries } from "../data/countries.js";
import { products } from "../data/db.js";
import fetchData from "../fetchData/fetchData.js";
import { renderProducts } from "../functions/renderProducts.js";

let categoriesApplied = [];
let minPriceApplied = null;
let maxPriceApplied = null;
let countryApplied = null;

const appliedFiltersBadges = document.getElementById('appliedFiltersBadges');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

document.addEventListener("DOMContentLoaded", function () {
  getProducts();
  filterProductsByCategory();
  filterProductsByCountries();
  filterProductsByPrice();
  updateFilterBadges();
});

async function getProductsData() {
  const body = {
    "minPrice": 10.0,
    "maxPrice": 200.0,
    "status": "",
    "size": 10
  }
  const params = {
    "minPrice": 10.0,
    "maxPrice": 200.0,
    "status": "",
    "size": 10
  }
  try {
    const data = await fetchData('/products', 'POST', params, body);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }

}

const getProducts = async () => {
  const container = document.getElementById('container-products');
  let products = await getProductsData();       
  let productsArray = products.items;      
  container.innerHTML = renderProducts(productsArray);
};

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
    const dropdownToggle = document.querySelector('#dropdownFilterCategories > button');
    bootstrap.Dropdown.getInstance(dropdownToggle).hide();
    updateFilterBadges();
    logAppliedFilters();
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

  // Vincular sincronización
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

  // Vincular sincronización
  syncCategoryCheckboxes();
}

function syncCategoryCheckboxes() {
  categoriesList.forEach(category => {
    const desktopCheckbox = document.getElementById(`cat-desktop-${category}`);
    const mobileCheckbox = document.getElementById(`cat-mobile-${category}`);

    if (desktopCheckbox && mobileCheckbox) {
      // Desktop → Mobile
      desktopCheckbox.addEventListener('change', () => {
        mobileCheckbox.checked = desktopCheckbox.checked;
        updateCategoriesApplied();
      });

      // Mobile → Desktop
      mobileCheckbox.addEventListener('change', () => {
        desktopCheckbox.checked = mobileCheckbox.checked;
        updateCategoriesApplied();
      });
    }
  });
}

function updateCategoriesApplied() {
  categoriesApplied = getSelectedCategories(); // Recolecta desde ambas vistas
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

  document.getElementById("select-country").addEventListener("change", (e) => {
    countryApplied = e.target.value !== "0" ? e.target.value : null;
    updateFilterBadges();
    logAppliedFilters();
  });
}

function renderCountryOptionsMobile(filter = "") {
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
  });
}

function updateFilterBadges() {
  console.log("entro a updateFilterBadges");
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
});

function logAppliedFilters() {
  console.log(categoriesApplied);
  const filters = {
    categorías: categoriesApplied.length > 0 ? categoriesApplied : null,
    país: countryApplied || null,
    precio_min: minPriceApplied,
    precio_max: maxPriceApplied
  };
  console.log("Filtros aplicados:", filters);
}
