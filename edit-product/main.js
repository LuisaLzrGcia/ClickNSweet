import { loadProductData } from "./loadProductData";
import { populateForm } from "./populateForm";

// Event listeners para cálculos en tiempo real

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("product-price").addEventListener("input", updateSalePrice);
  document.getElementById("product-discount").addEventListener("input", updateSalePrice);
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product-id");

  //   if (!productId) {
  //     showError('Producto no especificado');
  //     return;
  //   }

  disableForm(true);
  //   showLoader();

  try {
    const productData = loadProductData();
    populateForm(productData);

    // await loadSelectOptions();
  } catch (error) {
    showError(`Error: ${error.message}`);
  } finally {
    disableForm(false);
    // hideLoader();
  }
});
