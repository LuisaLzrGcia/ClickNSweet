import { productDetailView } from "./productDetailView.js";

window.addEventListener('DOMContentLoaded', () => {
    createProductDetails()
  });

  function createProductDetails() {
    const currentItem = JSON.parse(localStorage.getItem("currenProduct")) || {};
    const container = document.getElementById('product-detail-container');
    
    if (container) {
        container.innerHTML = productDetailView(currentItem);
    }
  }