import { countries } from "../data/countries.js";
import { statesMexico } from "../data/statesMexico.js";
import { products } from "../data/db.js";
import { renderStars } from "../functions/renderStars.js";


// Obtener ID de la URL
export function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product-id');
}

// Obtener datos del producto
export function fetchProduct(id) {
  // const response = await fetch(`/api/products/${id}`);
  // if (!response.ok) throw new Error('Producto no encontrado');
  // return await response.json();
  const productData = products.find((product) => product.id === Number(id));
  return productData;
}

// Cargar datos de referencia
export async function loadReferenceData() {
  try {
    // const [countries, states] = await Promise.all([
    //     fetch('/api/countries').then(res => res.json()),
    //     fetch('/api/states').then(res => res.json())
    // ]);

    // Poblar selectores
    populateSelect('country-edit-product', countries);
    populateSelect('state-edit-product', statesMexico);

  } catch (error) {
    console.error('Error cargando datos de referencia:', error);
  }
}

// Poblar formulario con datos
export function populateForm(data) {
  // Campos básicos
  document.getElementById('product-id').value = data.id;
  document.getElementById('name-edit-product').value = data.name;
  document.getElementById('description-edit-product').value = data.description;
  document.getElementById('price-edit-product').value = data.pricing;
  document.getElementById('discount-edit-product').value = data.discount || 0;
  document.getElementById('price-discount-edit-product').value = calculateSalePrice(data.pricing, data.discount);

  // Selectores
  setSelectedOption('price-format-edit-product', data.sales_format);
  // setSelectedOption('country-edit-product', data.country);
  // setSelectedOption('state-edit-product', data.state);
  setSelectedOption('category-edit-product', data.category);
  setSelectedOption('allow-reserve-edit', data.allow_reservations ? 'Si' : 'No');

  // Inventario
  // document.getElementById('sku-edit-product').value = data.sku;
  // document.getElementById('stock-edit-product').value = data.stock;
  // document.getElementById('stock-threshold-edit').value = data.low_stock_threshold;

  // Envío
  // document.getElementById('weight-edit-product').value = data.weight;
  // const dimensions = data.dimensions.split('x');
  // const dimensionInputs = document.querySelectorAll('[name="length"], [name="width"], [name="height"]');
  // dimensionInputs.forEach((input, i) => input.value = dimensions[i]?.trim() || 0);

  // Ubicación
  setSelectedOption('country-edit-product', data.country);
  toggleMexicanState(document.getElementById('country-edit-product'));
  if (data.country === 'México') {
    setSelectedOption('state-edit-product', data.state);
  }
  // console.log("Llega a donde debe")
  // Imagen existente
  if (data.picture) {
    document.getElementById('current-image-preview').innerHTML = `
            <div class="d-flex align-items-center mt-2">
                <img src="${data.picture}" alt="Imagen actual" class="img-thumbnail me-2" style="max-height: 100px">
                <small>Imagen actual</small>
            </div>
        `;
  }
}

// Calcular precio de oferta
export function calculateSalePrice(price, discount) {
  return discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : '';
}

// Configurar event listeners
export function setupEventListeners() {
  // Cálculo de precio de oferta
  document.getElementById('price-edit-product').addEventListener('input', updateSalePrice);
  document.getElementById('discount-edit-product').addEventListener('input', updateSalePrice);

  // Envío de formulario
  document.getElementById('form-editar-producto').addEventListener('submit', handleFormSubmit);

  // Vista previa
  document.getElementById('preview-btn').addEventListener('click', generatePreview);
}

// Actualizar precio de oferta en tiempo real
export function updateSalePrice() {
  const price = parseFloat(document.getElementById('price-edit-product').value) || 0;
  const discount = parseFloat(document.getElementById('discount-edit-product').value) || 0;
  document.getElementById('price-discount-edit-product').value = calculateSalePrice(price, discount);
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault();
  console.log("Se llama este método")
  const form = e.target;
  const formData = new FormData(form);
  const productId = formData.get('id');

  try {
    // Validación adicional antes de enviar
    if (!validateForm()) {
      alert("Faltan por complear campos")
      return
    }

    // showLoader();

    // const response = await fetch(`/api/products/${productId}`, {
    //     method: 'PUT',
    //     body: formData
    // });

    // if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Error actualizando producto');
    // }

    // showSuccess('Producto actualizado correctamente');
    // // Redirigir después de 2 segundos
    // setTimeout(() => window.location.href = '/admin/products', 2000);
    alert("Actualizado correctamente")

  } catch (error) {
    showError(`Error: ${error.message}`);
  } finally {
    // hideLoader();
  }
}

// Validación de formulario
export function validateForm() {
  // Validación básica de campos requeridos
  const requiredFields = [
    'name', 'description', 'price', 'sale_format',
    'category', 'country', 'sku', 'stock'
  ];

  for (const field of requiredFields) {
    const value = document.querySelector(`[name="${field}"]`).value;
    if (!value || value.trim() === '') {
      showError(`El campo ${field} es requerido`);
      return false;
    }
  }

  // Validación numérica
  const price = parseFloat(document.getElementById('price-edit-product').value);
  if (isNaN(price)) {
    showError('El precio debe ser un número válido');
    return false;
  }

  return true;
}

// Funciones auxiliares
export function setSelectedOption(selectId, value) {
  const select = document.getElementById(selectId);
  if (!select) return;

  for (let option of select.options) {
    if (option.value == value) {
      option.selected = true;
      break;
    }
  }
}

export function populateSelect(selectId, options) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '';
  options.forEach(option => {
    const optElement = document.createElement('option');
    // optElement.value = option.id;
    optElement.textContent = option;
    optElement.textValue = option;
    select.appendChild(optElement);
  });
}

export function toggleMexicanState(selectElement) {
  const stateContainer = document.getElementById('state-mexico-edit-product');
  const stateSelect = document.getElementById('state-edit-product');

  if (selectElement.value === 'México') {
    stateContainer.style.display = 'block';
    stateSelect.disabled = false;
    stateSelect.required = true;
  } else {
    stateContainer.style.display = 'none';
    stateSelect.disabled = true;
    stateSelect.required = false;
    stateSelect.value = '';
  }
}

// Funciones de UI
export function disableForm(disabled) {
  const form = document.getElementById('form-editar-producto');
  Array.from(form.elements).forEach(el => {
    el.disabled = disabled;
  });
}

function showLoader() {
  // Implementar spinner
}

function showSuccess(message) {
  // Implementar notificación de éxito
}

function showError(message) {
  // Implementar notificación de error
}





document.addEventListener('DOMContentLoaded', () => {
  // Referencias del DOM
  const previewModalEl = document.getElementById('previewModal');
  const previewImageContainer = document.getElementById('preview-image-container');
  const previewImage = document.getElementById('preview-image');
  const previewName = document.getElementById('preview-name');
  const previewDescription = document.getElementById('preview-description');
  const previewRating = document.getElementById('preview-rating');
  const previewPriceWrapper = document.getElementById('preview-price-wrapper');
  const previewSalesFormat = document.getElementById('preview-sales-format');
  const previewCategory = document.getElementById('preview-category');
  const previewOrigin = document.getElementById('preview-origin');
  const previewAvailability = document.getElementById('preview-availability');
  const confirmBtn = document.getElementById('confirm-edit-btn');
  const formEl = document.getElementById('form-editar-producto');

  function generatePreview() {
    // FormData
    const formData = {
      name: document.getElementById('name-edit-product').value,
      description: document.getElementById('description-edit-product').value,
      pricing: document.getElementById('price-edit-product').value,
      discount: document.getElementById('discount-edit-product').value || 0,
      price_discount: document.getElementById('price-discount-edit-product').value,
      sales_format: document.getElementById('price-format-edit-product').value,
      category: document.getElementById('category-edit-product').value,
      country: document.getElementById('country-edit-product').value,
      stock: parseInt(document.getElementById('stock-edit-product').value, 10),
      pictureFile: document.getElementById('image-edit-product').files[0]
    };

    // --- Imagen + estado ---
    // Fuente de la imagen
    if (formData.pictureFile) {
      const reader = new FileReader();
      reader.onload = e => previewImage.src = e.target.result;
      reader.readAsDataURL(formData.pictureFile);
    } else {
      const existing = document.querySelector('#current-image-preview img');
      previewImage.src = existing
        ? existing.src
        : 'https://via.placeholder.com/400x400?text=Sin+imagen';
    }

    // Estado
    // Elimina cualquier status anterior
    const prevStatus = previewImageContainer.querySelector('.status-product');
    if (prevStatus) prevStatus.remove();
    if (formData.stock === 0) {
      const span = document.createElement('span');
      span.className = 'status-product';
      span.textContent = 'Agotado';
      previewImageContainer.appendChild(span);
    }

    // --- Texto ---
    previewName.textContent = formData.name;
    previewDescription.textContent = formData.description;

    // Rating estático: 4 estrellas
    previewRating.innerHTML = renderStars(4);

    // --- Precios ---
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 2
    });
    if (formData.discount > 0) {
      previewPriceWrapper.innerHTML = `
        <p class="text-fuchsia mb-1">
          <span class="discount">${formData.discount}% OFF</span>
          <strong class="offerBadge">Promoción</strong>
        </p>
        <span class="new-price">${formatter.format(formData.price_discount)}</span>
        <span class="old-price">${formatter.format(formData.pricing)}</span>
      `;
    } else {
      previewPriceWrapper.innerHTML = `
        <span class="normal-price">${formatter.format(formData.pricing)}</span>
      `;
    }

    // Presentación / formato de venta
    previewSalesFormat.textContent = formData.sales_format;

    // Info adicional
    previewCategory.textContent = formData.category;
    previewOrigin.textContent = formData.country;
    previewAvailability.innerHTML = formData.stock > 0
      ? `<span class="badge bg-mint-light text-dark fs-6">En stock</span>`
      : `<span class="badge bg-mint-light text-dark fs-6">Agotado</span>`;

    // Mostrar modal
    new bootstrap.Modal(previewModalEl).show();
  }

  // Listeners
  confirmBtn.addEventListener('click', (e) => {
    bootstrap.Modal.getInstance(previewModalEl).hide();
    // formEl.dispatchEvent(new Event('submit'));
    e.preventDefault();
    handleFormSubmit({ target: formEl, preventDefault: () => e.returnValue = false });
  });

  [
    'name-edit-product', 'description-edit-product', 'price-edit-product',
    'discount-edit-product', 'price-discount-edit-product', 'price-format-edit-product',
    'category-edit-product', 'country-edit-product', 'stock-edit-product',
    'image-edit-product'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (previewModalEl.classList.contains('show')) {
          generatePreview();
        }
      });
    }
  });

  window.generatePreview = generatePreview;
});
