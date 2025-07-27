import { products } from "../data/db.js";

export async function updateProductStatus(productId, isActive) {
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    const switchElement = card.querySelector(`#toggle-${productId}`);
    try {
        
        // Aplicar estado de carga
        card.classList.add('loading-state');
        
        // Deshabilitar el switch durante la actualización
        switchElement.disabled = true;
        
        // Simular retardo de red (800ms)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Actualizar el producto en el array
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products[productIndex].status = isActive ? "active" : "inactive";
        }
        
        console.log(`Producto ${productId} actualizado a ${isActive ? 'activo' : 'inactivo'}`);
        
        return true;
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        
        // Mostrar error al usuario
        Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el estado del producto. Intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        switchElement.checked = !switchElement.checked;
        return false;
    } finally {
        // Quitar estado de carga y habilitar el switch
        const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        if (card) {
            card.classList.remove('loading-state');
            const switchElement = card.querySelector(`#toggle-${productId}`);
            if (switchElement) switchElement.disabled = false;
        }
    }
}