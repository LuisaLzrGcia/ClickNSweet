// main-manage-products/updateProductStatus.js
import fetchData from "../fetchData/fetchData.js";
import { products } from "../data/db.js"; // si ya no usas mock, puedes borrar esta import

export async function updateProductStatus(productId, isActive) {
  const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
  const switchElement = card ? card.querySelector(`#toggle-${productId}`) : null;

  try {
    // 1) Estado de carga y bloqueo del switch (misma UX actual)
    if (card) card.classList.add("loading-state");
    if (switchElement) switchElement.disabled = true;

    // 2) (Opcional) retardo para simular red/UX como en tu lógica actual
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 3) Cargar producto actual del BackEnd
    const current = await fetchData(`/product/${productId}`, "GET");

    // 4) Armar payload con el status actualizado (el back espera boolean)
    const payload = {
      ...current,
      status: !!isActive,
    };

    // 5) Guardar en BackEnd
    await fetchData(`/product/${productId}`, "PUT", {}, payload);

    // 6) Mantener coherencia con tu mock local (si sigues importando products)
    try {
      if (Array.isArray(products)) {
        const idx = products.findIndex((p) => String(p.id) === String(productId));
        if (idx !== -1) products[idx].status = isActive ? "active" : "inactive";
      }
    } catch (_) {
      // si no existe el mock o cambiaste a backend-only, no pasa nada
    }

    console.log(`Producto ${productId} actualizado a ${isActive ? "activo" : "inactivo"}`);
    return true;
  } catch (error) {
    console.error("Error al actualizar estado:", error);

    // Revertir el switch visual si falló
    if (switchElement) switchElement.checked = !isActive;

    // Feedback de error (SweetAlert si está disponible)
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado del producto. Intente nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } else {
      alert("No se pudo actualizar el estado del producto. Intente nuevamente.");
    }
    return false;
  } finally {
    // 7) Quitar estado de carga y habilitar el switch
    if (card) card.classList.remove("loading-state");
    if (switchElement) switchElement.disabled = false;
  }
}
