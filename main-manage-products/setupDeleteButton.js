import { products } from "../data/db.js";
import { showFeedback } from "./showFeedback.js";

// Función para configurar botones de borrado
export function setupDeleteButtons() {
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const card = this.closest(".product-card");
      const productId = parseInt(card.dataset.productId);
      const productName = card.querySelector(".card-title").textContent.trim();
      const productCardContainer = this.closest(".product-card-container");

      // Confirmación antes de borrar
      const result = await Swal.fire({
        title: "¿Eliminar producto?",
        html: `Estás a punto de eliminar permanentemente:<br><strong>${productName}</strong>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        customClass: {
          confirmButton: "btn btn-danger mx-2",
          cancelButton: "btn btn-secondary mx-2",
        },
        backdrop: "rgba(0,0,0,0.4)",
      });

      if (result.isConfirmed) {
        // Aplicar efecto visual de eliminación
        card.classList.add("deleting");

        try {
          // Simular petición al backend
          await deleteProduct(productId);

          // Eliminar del DOM después de la animación
          setTimeout(() => {
            card.remove();
            productCardContainer.remove();

            showFeedback(`${productName} ha sido eliminado`);
          }, 200);
        } catch (error) {
          // Manejar error
          card.classList.remove("deleting");
          showFeedback(`Error al eliminar "${productName}`);
          console.error("Error eliminando producto:", error);
        }
      }
    });
  });
}

// Función para simular eliminación en backend
async function deleteProduct(productId) {
  // Simular retardo de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Simular éxito (en implementación real, aquí harías fetch a tu API)
  const success = true;

  if (success) {
    // Eliminar del array de productos
    const index = products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      products.splice(index, 1);
    }
    return true;
  } else {
    // Simular error
    throw new Error("Error en el servidor al eliminar el producto");
  }
}
