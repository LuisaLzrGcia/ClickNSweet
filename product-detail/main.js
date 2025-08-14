// product-detail/main.js
import { productDetailView, productReviewsView, initProductReviews } from "./productDetailView.js";

window.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("currenProduct")) || {};

  // 1) Cuadro del producto
  const detailContainer = document.getElementById("product-detail-container");
  if (detailContainer) {
    detailContainer.innerHTML = productDetailView(product);
  }

  // 2) Cuadro de reseñas (en un contenedor separado)
  // Opción A: si tienes <div id="reviews-root"></div> en el HTML:
  const reviewsRoot = document.getElementById("reviews-root");
  if (reviewsRoot) {
    reviewsRoot.innerHTML = productReviewsView();
  } else {
    // Opción B: si tienes <section id="product-reviews"></section> vacío:
    const section = document.getElementById("product-reviews");
    if (section) section.innerHTML = productReviewsView();
  }

  // 3) Cargar reseñas desde el backend
  initProductReviews(product);
});



