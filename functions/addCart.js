// import { loadCartCount } from "./loadCartCount.js";

window.addCart = function (element) {
  const id = Number(element.dataset.id);
  const name = element.dataset.name;
  const pricing = Number(element.dataset.pricing);
  const category = element.dataset.category;
  const description = element.dataset.description;
  const origen = element.dataset.origen;
  const picture = element.dataset.picture;
  const sales_format = element.dataset.sales_format;
  const discount = Number(element.dataset.discount);
  const price_discount = Number(element.dataset.price_discount);
  const rating = Number(element.dataset.rating);
  const country = element.dataset.country;
  const stock = element.dataset.stock === "true";

  const newProduct = {
    id: id,
    name: name,
    pricing: pricing,
    category: category,
    description: description,
    origen: origen,
    picture: picture,
    sales_format: sales_format,
    discount: discount,
    price_discount: price_discount,
    rating: rating,
    country: country,
    stock: stock,
    quantity: 1,
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // let cartCountStorage = JSON.parse(localStorage.getItem("cartCount")) || 0;

  const existingProductIndex = cart.findIndex((item) => item.id === newProduct.id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push(newProduct);
  }
  // cartCountStorage++;
  localStorage.setItem("cart", JSON.stringify(cart));
  // localStorage.setItem("cartCount", JSON.stringify(cartCountStorage));

  // loadCartCount();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${name} agregado al carrito`,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#fff", // color de fondo suave
    color: "#CA535F", // color del texto
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};
