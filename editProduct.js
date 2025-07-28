// 1. Cargar datos del producto al iniciar
document.addEventListener('DOMContentLoaded', async () => {
  // Obtener ID de URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    showError('Producto no especificado');
    return;
  }

  // Deshabilitar formulario durante carga
  disableForm(true);
  showLoader();

  try {
    // Obtener datos del producto
    const productData = await fetchProduct(productId);
    
    // Poblar formulario
    populateForm(productData);
    
    // Cargar opciones de selectores (ej: desde API)
    await loadSelectOptions();
    
  } catch (error) {
    showError(`Error: ${error.message}`);
  } finally {
    disableForm(false);
    hideLoader();
  }
});

// 2. Función para obtener producto
async function fetchProduct(id) {
  const response = await fetch(`/api/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Producto no encontrado');
  }
  
  return await response.json();
}

// 3. Poblar campos del formulario
function populateForm(data) {
  // Campos directos
  document.getElementById('product-db-id').value = data.id;
  document.getElementById('product-name').value = data.name || '';
  document.getElementById('product-description').value = data.description || '';
  document.getElementById('product-price').value = data.price || 0;
  document.getElementById('product-discount').value = data.discount || 0;
  document.getElementById('product-stock').value = data.stock || 0;
  
  // Selectores
  setSelectedOption('product-flavor', data.flavor_category_id);
  setSelectedOption('product-country', data.country_id);
  setSelectedOption('product-usage', data.usage_id);
  
  // Calcular precio de oferta
  updateSalePrice();
}

// 4. Utilidad para selectores
function setSelectedOption(selectId, value) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  for (let option of select.options) {
    if (option.value == value) {
      option.selected = true;
      break;
    }
  }
}

// 5. Cargar opciones dinámicas (ejemplo)
async function loadSelectOptions() {
  try {
    const [flavors, countries, usages] = await Promise.all([
      fetchOptions('/api/flavors'),
      fetchOptions('/api/countries'),
      fetchOptions('/api/usages')
    ]);
    
    populateSelect('product-flavor', flavors);
    populateSelect('product-country', countries);
    populateSelect('product-usage', usages);
    
  } catch (error) {
    console.error('Error cargando opciones:', error);
  }
}

// 6. Lógica para calcular precio de oferta
function updateSalePrice() {
  const price = parseFloat(document.getElementById('product-price').value) || 0;
  const discount = parseFloat(document.getElementById('product-discount').value) || 0;
  
  const salePrice = discount > 0 
    ? price * (1 - discount / 100) 
    : 0;
  
  document.getElementById('product-sale-price').value = salePrice.toFixed(2);
}

// Event listeners para cálculos en tiempo real
document.getElementById('product-price').addEventListener('input', updateSalePrice);
document.getElementById('product-discount').addEventListener('input', updateSalePrice);

// 7. Envío del formulario
document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const productId = formData.get('id');
  
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Error actualizando producto');
    }
    
    showSuccess('Producto actualizado correctamente');
    
  } catch (error) {
    showError(`Error: ${error.message}`);
  }
});

// --- Funciones auxiliares ---
function disableForm(disabled) {
  const form = document.getElementById('edit-product-form');
  Array.from(form.elements).forEach(el => {
    el.disabled = disabled;
  });
}

function showLoader() {
  // Implementar spinner (ej: Bootstrap)
}

function showSuccess(message) {
  // Implementar notificación
}

function showError(message) {
  // Implementar notificación de error
}