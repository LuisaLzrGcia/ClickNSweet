import { categoriesList } from "../data/categories.js";
import { countries } from "../data/countries.js";
import { products } from "../data/db.js";
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

const getProducts = async () => {
  const container = document.getElementById('container-products');
  const productsArray = products;
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
  const categoryList = document.getElementById('categoryList');

  renderCategories();
  renderCategoriesMobile();

  document.getElementById('applyCategoryFilter').addEventListener('click', () => {
    categoriesApplied = getSelectedCategories();
    const dropdownToggle = document.querySelector('#dropdownFilterCategories > button');
    bootstrap.Dropdown.getInstance(dropdownToggle).hide();
    updateFilterBadges();
  });
}

function renderCategories() {
  let checkboxesHTML = "<h5>Categorías</h5>";
  categoriesList.forEach(category => {
    checkboxesHTML += `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="${category}">
            <label class="form-check-label" for="${category}">${category}</label>
          </div>
      `;
  });
  const categoryList = document.getElementById('sidebar-categories');

  categoryList.innerHTML = checkboxesHTML;
}

function renderCategoriesMobile() {
  let checkboxesHTML = "";
  categoriesList.forEach(category => {
    checkboxesHTML += `
        <li>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${category}" id="cat-${category}">
            <label class="form-check-label" for="cat-${category}">${category}</label>
          </div>
        </li>
      `;
  });
  const categoryList = document.getElementById('categoryList');
  // Mantener el botón al final
  const applyButtonLI = categoryList.querySelector('li:last-child');
  categoryList.innerHTML = checkboxesHTML;
  if (applyButtonLI) categoryList.appendChild(applyButtonLI);
}

function getSelectedCategories() {
  const checkboxes = document.querySelectorAll('#categoryList input[type="checkbox"]');
  const selectedCategories = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  });

  return selectedCategories;
}

function filterProductsByCountries() {
  const dropdownButton = document.getElementById("dropdownButton");
  const countrySearch = document.getElementById("countrySearch");
  const countryOptions = document.getElementById("countryOptions");

  countrySearch.addEventListener("input", (e) => {
    renderCountryOptionsMobile(e.target.value);
  });

  renderCountryOptions()
  renderCountryOptionsMobile();


  // Inicializar dropdown Bootstrap para cerrar desde JS
  const dropdown = new bootstrap.Dropdown(dropdownButton);
}

function renderCountryOptions() {
  const countryContainer = document.getElementById("sidebar-countries");

  let countriesOptions = `
    <h6 class="filter-title">País</h6>
    <select class="form-select">
    <option selected value="0">Todos</option>
      ${countries.map(country => `<option value="${country}">${country}</option>`).join('')}
    </select>
  `;

  countryContainer.innerHTML = countriesOptions;
}


function renderCountryOptionsMobile(filter = "") {
  countryOptions.innerHTML = "";
  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length === 0) {
    countryOptions.innerHTML = `<div class="dropdown-item disabled">No se encontraron países</div>`;
    return;
  }

  filteredCountries.forEach(country => {
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#";
    a.textContent = country;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      dropdownButton.textContent = country;
      countryApplied = country;  // Guardamos país seleccionado
      countrySearch.value = "";
      renderCountryOptions();
      bootstrap.Dropdown.getInstance(dropdownButton).hide();
      updateFilterBadges();
    });
    countryOptions.appendChild(a);
  });
}

function filterProductsByPrice() {
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const applyBtn = document.getElementById('applyPriceFilter');
  const dropdownBtn = document.getElementById('priceDropdownButton');

  function applyPriceFilter() {
    minPriceApplied = minPriceInput.value !== "" ? minPriceInput.value : null;
    maxPriceApplied = maxPriceInput.value !== "" ? maxPriceInput.value : null;

    if (minPriceApplied === null && maxPriceApplied === null) {
      console.log("No hay rango de precio seleccionado");
    } else if (minPriceApplied !== null && maxPriceApplied !== null) {
      console.log(`Rango de precio aplicado: desde ${minPriceApplied} hasta ${maxPriceApplied}`);
    } else if (minPriceApplied !== null) {
      console.log(`Precio mínimo aplicado: ${minPriceApplied}`);
    } else if (maxPriceApplied !== null) {
      console.log(`Precio máximo aplicado: ${maxPriceApplied}`);
    }

    bootstrap.Dropdown.getInstance(dropdownBtn).hide();
    updateFilterBadges();
  }

  applyBtn.addEventListener('click', applyPriceFilter);
}

function updateFilterBadges() {
  let badgesHTML = "";

  if (categoriesApplied.length > 0) {
    categoriesApplied.forEach(cat => {
      badgesHTML += `<span class="badge badge-category me-1">${cat}</span>`;
    });
  }

  if (countryApplied && countryApplied !== "Selecciona un país") {
    badgesHTML += `<span class="badge badge-country me-1">${countryApplied}</span>`;
  }

  if (minPriceApplied !== null) {
    badgesHTML += `<span class="badge badge-price  text-dark me-1">Precio mínimo: ${minPriceApplied}</span>`;
  }
  if (maxPriceApplied !== null) {
    badgesHTML += `<span class="badge badge-price text-dark me-1">Precio máximo: ${maxPriceApplied}</span>`;
  }

  appliedFiltersBadges.innerHTML = badgesHTML;

  // Mostrar botón solo si hay algún badge (filtro activo)
  if (badgesHTML.trim() !== "") {
    clearFiltersBtn.style.display = "inline-block";
  } else {
    clearFiltersBtn.style.display = "none";
  }
}


// Botón para remover filtros
clearFiltersBtn.addEventListener('click', () => {
  // Limpiar categorías
  const checkboxes = document.querySelectorAll('#categoryList input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  categoriesApplied = [];

  // Limpiar país
  countryApplied = null;
  const dropdownButton = document.getElementById("dropdownButton");
  dropdownButton.textContent = "País";

  // Limpiar precio
  minPriceApplied = null;
  maxPriceApplied = null;
  document.getElementById('minPrice').value = "";
  document.getElementById('maxPrice').value = "";

  console.log("Todos los filtros han sido removidos");
  updateFilterBadges();
});


document.getElementById("applyPriceFilter").addEventListener("click", function () {
  const selectedCountry = document.querySelector("#sidebar-countries select").value;
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;

  const appliedFilters = {
    country: selectedCountry !== "0" ? selectedCountry : null,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
  };

  console.log("Filtros aplicados:", appliedFilters);
});
