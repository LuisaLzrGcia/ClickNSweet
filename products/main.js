import { products } from "../data/db.js";
import { renderProducts } from "../functions/renderProducts.js";


document.addEventListener("DOMContentLoaded", function () {
  getProducts();
});

const getProducts = async () => {
  const container = document.getElementById('container-products');
  const productsArray = products
  container.innerHTML = renderProducts(productsArray);

}


document.getElementById('sort-new').addEventListener('click', () => {
  renderProducts([...products].reverse()); // Si los nuevos están al final
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



