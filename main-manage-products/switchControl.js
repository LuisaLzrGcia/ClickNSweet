import { updateProductStatus } from "./updateProductStatus.js";
import { showFeedback } from "./showFeedback.js"

export function switchControl() {
        document.querySelectorAll(".custom-switch").forEach((toggle) => {
            toggle.addEventListener("change", async function (e) {
                const isChecked = this.checked;
                const productId = this.dataset.productId;
                const card = this.closest(".product-card");
                // const label = card.querySelector(".switch-state-text");
                const productName = card.querySelector('.card-title').textContent.trim();


                if (!isChecked) {
                    // Mostrar alerta de confirmación con SweetAlert2
                    Swal.fire({
                    title: '¿Desactivar producto?',
                    text: `El producto ${productName} dejará de estar disponible para los clientes.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, desactivar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true,
                    customClass: {
                        confirmButton: 'btn btn-pink mx-2',
                        cancelButton: 'btn btn-secondary mx-2'
                    }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Aplicar estado inactivo
                            card.classList.add("inactive");
                            // label.textContent = "Inactivo";
                            updateProductStatus(productId, false)
                            
                        } else {
                            // Revertir el cambio del switch
                            toggle.checked = true;
                            // label.textContent = "Activo";
                        }
                    });
                } else {
                    // Re-activar producto sin confirmación
                    card.classList.remove("inactive");
                    // label.textContent = "Activo";
                    await updateProductStatus(productId, true);
                    showFeedback(`${productName} activado correctamente`);
                }
            });
        });
}
