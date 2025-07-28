// 7. Envío del formulario
document.getElementById("edit-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const productId = formData.get("id");

  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error actualizando producto");
    }

    showSuccess("Producto actualizado correctamente");
  } catch (error) {
    showError(`Error: ${error.message}`);
  }
});

// --- Funciones auxiliares ---
function disableForm(disabled) {
  const form = document.getElementById("edit-product-form");
  Array.from(form.elements).forEach((el) => {
    el.disabled = disabled;
  });
}

function showLoader() {
  // Implementar spinner (ej: Bootstrap)
}

function showSuccess(message) {
  // Implementar notificación
}

function showError(message) {
  // Implementar notificación de error
}
