import { products } from "../data/db.js";
import { loadCategoryCassurel } from "../functions/loadCategoryCassurel.js"
import { renderProducts } from "../functions/renderProducts.js";
import { getProductsData } from "../products/getProductsData.js";

document.addEventListener("DOMContentLoaded", () => {
  loadCategoryCassurel()

  loadProductsMain()
});


async function loadProductsMain() {
  const container = document.getElementById('container-products-main');
  if (!container) return; // previene errores si no existe el contenedor

  try {
    const productsArray = await getProductsData({ size: 4, page: 0 });
    container.innerHTML = renderProducts(productsArray.items, "index");
  } catch (error) {
    console.error("Error cargando productos:", error);
    container.innerHTML = "<p>No se pudieron cargar los productos.</p>";
  }
}
