
export function switchControl() {
        document.querySelectorAll(".custom-switch").forEach((toggle) => {
            toggle.addEventListener("change", function (e) {
                const isChecked = this.checked;
                const productId = this.dataset.productId;
                const card = this.closest(".product-card");
                const label = card.querySelector(".switch-state-text");

                if (!isChecked) {
                    // Mostrar alerta de confirmación con SweetAlert2
                    Swal.fire({
                        title: '¿Desactivar producto?',
                        text: 'Este producto dejará de estar disponible para los clientes.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, desactivarlo',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Aplicar estado inactivo
                            card.classList.add("inactive");
                            // label.textContent = "Inactivo";
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
                }
            });
        });
}
