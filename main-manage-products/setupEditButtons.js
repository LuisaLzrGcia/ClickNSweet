import { products } from "../data/db.js";
console.log(products)

// Función para configurar botones de editar
export function setupEditButtons() {
  document.querySelectorAll(".edit-button-admin").forEach((btn) => {
    console.log("asdfas")
    btn.addEventListener("click", function () {
      console.log('antes')
      console.log(products)
      const card = this.closest(".product-card");
      const productId = card.dataset.productId
      console.log(products)
      window.location.href = `/edit-product/index.html?id=${productId}`;
      console.log(products)
    });
  });
}
