// Función para configurar botones de editar
export function setupEditButtons() {
  document.querySelectorAll(".edit-button-admin").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const card = this.closest(".product-card");
      const productId = parseInt(card.dataset.productId);
      window.location.href = `edit-product.html?product-id=${productId}`;
    });
  });
}
