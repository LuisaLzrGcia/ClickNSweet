import { loadCartCount } from "./loadCartCount.js";

window.addCart = function(element) {
  const id = Number(element.dataset.id);
  const name = element.dataset.name;

  let quantity = 1; // valor por defecto
  try {
    // Intentar obtener el select más cercano
    const selectCantidad = element.closest('.col-md-6')?.querySelector('#cantidad');
    if (selectCantidad) {
      quantity = Number(selectCantidad.value) || 1;
    }
  } catch (error) {
    // Si ocurre algún error, simplemente dejamos quantity = 1
    console.warn("No se encontró el select de cantidad, se usará 1 por defecto.");
  }

  const newProduct = { id, name, quantity };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex(item => item.id === newProduct.id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push(newProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartCount();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${name} agregado al carrito`,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#fff",
    color: "#CA535F",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};
