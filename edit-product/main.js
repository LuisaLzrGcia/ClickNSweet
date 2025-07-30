import { disableForm, fetchProduct, getProductIdFromURL, loadReferenceData, populateForm, setupEventListeners, toggleMexicanState } from "./utility_functions.js";

document.addEventListener('DOMContentLoaded', async () => {

    const countrySelect = document.getElementById('country-edit-product');
    countrySelect.addEventListener('change', (e) => toggleMexicanState(e.target))
    const productId = getProductIdFromURL();
    if (!productId) {
        alert('ID de producto no especificado');
        return;
    }

    disableForm(true);
    // showLoader();
    try {
        const productData = fetchProduct(productId);


        await loadReferenceData();

        populateForm(productData);

        setupEventListeners();

    } catch (error) {
        // showError(`Error cargando producto: ${error.message}`);
        console.log(`Error cargando producto: ${error.message}`)
    } finally {
        disableForm(false);
        // hideLoader();
    }
});
