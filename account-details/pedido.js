export function initPedido() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const storageKey = `pedidos_${user.email}`;
  const pedidos = JSON.parse(localStorage.getItem(storageKey)) || [];

  const contenedor = document.getElementById("pedidos");
  contenedor.innerHTML = `
    <h3 class="titulo-seccion">Mis pedidos</h3>
  `;

  if (pedidos.length === 0) {
    contenedor.innerHTML += `<p>No has realizado ningún pedido aún.</p>`;
    return;
  }

  pedidos.reverse().forEach((pedido) => {
    // Contenedor principal del pedido
    const pedidoDiv = document.createElement("div");
    pedidoDiv.classList.add("pedido", "mb-4");

    // Fecha del pedido
    const fechaP = document.createElement("p");
    fechaP.className = "fw-bold ";
    fechaP.textContent = `Fecha de pedido: ${pedido.fecha}`;
    pedidoDiv.appendChild(fechaP);

    // Por cada producto en el pedido crear una card con la info
    pedido.productos.forEach((producto, index) => {
      const card = document.createElement("div");
      card.className =
        "card p-2 d-flex flex-md-row align-items-center justify-content-between mb-2";

      // Contenedor izquierda: imagen + estado + fecha entrega
      const infoDiv = document.createElement("div");
      infoDiv.className = "d-flex align-items-center gap-3";

      // Imagen producto (usa url real o placeholder)
      const img = document.createElement("img");
      img.src = producto.imagen || "https://via.placeholder.com/50";
      img.alt = producto.nombre || "Imagen producto";
      img.className = "img-thumbnail";
      img.style.width = "50px";
      img.style.height = "50px";

      // Info texto
      const textoDiv = document.createElement("div");

      const estadoP = document.createElement("p");
      estadoP.className = "mb-1";
      estadoP.textContent = `Estatus: ${pedido.estado}`;

      const entregaSmall = document.createElement("small");
      entregaSmall.textContent = `Llega el ${pedido.deliveryDate}`;

      textoDiv.appendChild(estadoP);
      textoDiv.appendChild(entregaSmall);

      infoDiv.appendChild(img);
      infoDiv.appendChild(textoDiv);

      // Botón ver pedido
      const btn = document.createElement("button");
      btn.className = "btn btn-pink btn-sm mt-2 mt-md-0";
      btn.textContent = "Ver pedido";

      // Puedes agregar acción al botón aquí si quieres
      // btn.addEventListener("click", () => { ... });

      card.appendChild(infoDiv);
      card.appendChild(btn);

      pedidoDiv.appendChild(card);
    });

    contenedor.appendChild(pedidoDiv);
  });
}
