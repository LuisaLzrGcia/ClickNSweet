export function initPago() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const storageKey = `metodosPago_${user.email}`;
  let metodos = JSON.parse(localStorage.getItem(storageKey)) || [];

  const contenedor = document.getElementById("pagos");
  contenedor.innerHTML = `
    <h3 class="titulo-seccion">Métodos de Pago</h3>
    <ul id="lista-pagos" class="list-group mb-3"></ul>

    <h5>Agregar nuevo método</h5>
    <form id="form-pago">
      <div class="mb-2">
        <input type="text" id="nombreTarjeta" class="form-control" placeholder="Nombre en la tarjeta" required>
      </div>
      <div class="mb-2">
        <input type="text" id="numeroTarjeta" class="form-control" placeholder="Número de tarjeta" maxlength="16" required>
      </div>
      <div class="mb-2">
        <input type="month" id="fechaExpiracion" class="form-control" required>
      </div>
      <div class="mb-2">
        <input type="text" id="cvv" class="form-control" placeholder="CVV" maxlength="4" required>
      </div>
      <button type="submit" class="btn btn-pink">Guardar método</button>
    </form>
  `;

  const lista = document.getElementById("lista-pagos");
  const form = document.getElementById("form-pago");

  renderLista();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoMetodo = {
      id: Date.now(),
      nombre: document.getElementById("nombreTarjeta").value.trim(),
      numero: document.getElementById("numeroTarjeta").value.trim(),
      expiracion: document.getElementById("fechaExpiracion").value,
      cvv: document.getElementById("cvv").value.trim(),
    };

    if (
      !nuevoMetodo.nombre ||
      !/^\d{16}$/.test(nuevoMetodo.numero) ||
      !/^\d{3,4}$/.test(nuevoMetodo.cvv)
    ) {
      alert("Completa correctamente todos los campos.");
      return;
    }

    metodos.push(nuevoMetodo);
    localStorage.setItem(storageKey, JSON.stringify(metodos));
    form.reset();
    renderLista();
  });

  function renderLista() {
    lista.innerHTML = "";
    if (metodos.length === 0) {
      lista.innerHTML = `<li class="list-group-item">No tienes métodos de pago guardados.</li>`;
      return;
    }

    metodos.forEach((m) => {
      const item = document.createElement("li");
      item.className =
        "list-group-item d-flex justify-content-between align-items-center";
      item.innerHTML = `
        <div>
          <strong>${m.nombre}</strong><br>
          **** **** **** ${m.numero.slice(-4)}<br>
          Expira: ${m.expiracion}
        </div>
        <div>
          <button class="btn btn-sm btn-pink me-2" data-id="${
            m.id
          }" data-action="editar">Editar</button>
          <button class="btn btn-sm btn-pink" data-id="${
            m.id
          }" data-action="eliminar">Eliminar</button>
        </div>
      `;
      lista.appendChild(item);
    });

    // Botones editar y eliminar
    lista.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === "eliminar") {
          metodos = metodos.filter((m) => m.id !== id);
          localStorage.setItem(storageKey, JSON.stringify(metodos));
          renderLista();
        } else if (action === "editar") {
          const metodo = metodos.find((m) => m.id === id);
          if (metodo) {
            document.getElementById("nombreTarjeta").value = metodo.nombre;
            document.getElementById("numeroTarjeta").value = metodo.numero;
            document.getElementById("fechaExpiracion").value =
              metodo.expiracion;
            document.getElementById("cvv").value = metodo.cvv;

            metodos = metodos.filter((m) => m.id !== id); // lo quitamos para evitar duplicados
            localStorage.setItem(storageKey, JSON.stringify(metodos));
            renderLista();
          }
        }
      });
    });
  }
}
