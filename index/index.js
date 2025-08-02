import { products } from "../data/db.js";
import { loadCategoryCassurel } from "../functions/loadCategoryCassurel.js"
import { renderProducts } from "../functions/renderProducts.js";

document.addEventListener("DOMContentLoaded", () => {
  loadCategoryCassurel()

  loadProductsMain()
});


function loadProductsMain() {
  const container = document.getElementById('container-products-main');
  const productsArray = products
    .filter(product => product.stock === true)
    .slice(0, 4);

  container.innerHTML = renderProducts(productsArray, "index");
}