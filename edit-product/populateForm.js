function populateForm(data) {
  document.getElementById("product-db-id").value = data.id;
  document.getElementById("product-name").value = data.name || "";
  document.getElementById("product-description").value = data.description || "";
  document.getElementById("product-price").value = data.price || 0;
  document.getElementById("product-discount").value = data.discount || 0;
  document.getElementById("product-stock").value = data.stock || 0;

  // Selectores
  setSelectedOption("product-flavor", data.flavor_category_id);
  setSelectedOption("product-country", data.country_id);
  setSelectedOption("product-usage", data.usage_id);

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
      fetchOptions("/api/flavors"),
      fetchOptions("/api/countries"),
      fetchOptions("/api/usages"),
    ]);

    populateSelect("product-flavor", flavors);
    populateSelect("product-country", countries);
    populateSelect("product-usage", usages);
  } catch (error) {
    console.error("Error cargando opciones:", error);
  }
}

// 6. Lógica para calcular precio de oferta
function updateSalePrice() {
  const price = parseFloat(document.getElementById("product-price").value) || 0;
  const discount = parseFloat(document.getElementById("product-discount").value) || 0;

  const salePrice = discount > 0 ? price * (1 - discount / 100) : 0;

  document.getElementById("product-sale-price").value = salePrice.toFixed(2);
}
