import { products } from "../data/db.js";
import { renderDashboardProducts } from "./renderDashboardProducts.js";

document.addEventListener("DOMContentLoaded", function () {
  getProducts();
});

const getProducts = async () => {
  const container = document.getElementById("dashboard-products");
  container.innerHTML = renderDashboardProducts(products);
};

document.getElementById("sort-new").addEventListener("click", () => {
  renderDashboardProducts([...products].reverse()); // Si los nuevos están al final
});

document.getElementById("sort-price-asc").addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => a.price_discount - b.price_discount);
  renderDashboardProducts(sorted);
});

document.getElementById("sort-price-desc").addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => b.price_discount - a.price_discount);
  renderDashboardProducts(sorted);
});

document.getElementById("sort-rating").addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  renderDashboardProducts(sorted);
});
