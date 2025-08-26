import fetchData from "../fetchData/fetchData.js";
import { getCurrentItem } from "./getCurrentItem.js";
import { productDetailView, initProductReviews } from "./productDetailView.js"; 

window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const id = Number(idParam); // Convertimos a número

  // Si no es un número o menor o igual a 0, redirige
  if (!idParam || isNaN(id) || id <= 0) {
    window.location.href = "/not-found/index.html";
    return; // para que no siga ejecutándose
  }

  const container = document.getElementById('product-detail-container');

  // Mostrar mensaje de carga
  container.innerHTML = "<p style='font-weight: bold;'>Cargando producto...</p>";

  try {

    let currentItem = await getCurrentItem(id);

    // Renderizar el producto
    createProductDetails(currentItem);

    initProductReviews(currentItem);

  } catch (error) {
    container.innerHTML = "<p style='color:red;'>Error al cargar el producto</p>";
    console.error(error);
  }
});

function createProductDetails(currentItem) {
  const container = document.getElementById('product-detail-container');

  if (container) {
    container.innerHTML = productDetailView(currentItem, "detail");
  } else {
    console.warn("No se encontró el contenedor con id 'product-detail-container'");
  }
}
