export function initDireccion() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const storageKey = `direcciones_${user.email}`;
  let direcciones = JSON.parse(localStorage.getItem(storageKey)) || [];

  const contenedor = document.getElementById("direcciones");
  contenedor.innerHTML = `
    <h3 class="titulo-seccion">Direcciones guardadas</h3>
    <ul id="lista-direcciones" class="list-group mb-3"></ul>

    <h5>Agregar nueva dirección</h5>
    <form id="form-direccion">
      <div class="mb-2">
        <input type="text" id="nombreDireccion" class="form-control" placeholder="Nombre de la dirección (Ej. Casa, Trabajo)" required>
      </div>
      <div class="mb-2">
        <input type="text" id="calle" class="form-control" placeholder="Calle y número" required>
      </div>
      <div class="mb-2">
        <input type="text" id="colonia" class="form-control" placeholder="Colonia" required>
      </div>
      <div class="mb-2">
        <input type="text" id="ciudad" class="form-control" placeholder="Ciudad" required>
      </div>
      <div class="mb-2">
        <input type="text" id="estado" class="form-control" placeholder="Estado" required>
      </div>
      <div class="mb-2">
        <input type="text" id="codigoPostal" class="form-control" placeholder="Código Postal" required>
      </div>
      <button type="submit" class="btn btn-pink">Guardar dirección</button>
    </form>
  `;

  const lista = document.getElementById("lista-direcciones");
  const form = document.getElementById("form-direccion");

  renderLista();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevaDireccion = {
      id: Date.now(),
      nombre: document.getElementById("nombreDireccion").value.trim(),
      calle: document.getElementById("calle").value.trim(),
      colonia: document.getElementById("colonia").value.trim(),
      ciudad: document.getElementById("ciudad").value.trim(),
      estado: document.getElementById("estado").value.trim(),
      cp: document.getElementById("codigoPostal").value.trim(),
    };

    if (
      !nuevaDireccion.nombre ||
      !nuevaDireccion.calle ||
      !nuevaDireccion.colonia ||
      !nuevaDireccion.ciudad ||
      !nuevaDireccion.estado ||
      !nuevaDireccion.cp
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    direcciones.push(nuevaDireccion);
    localStorage.setItem(storageKey, JSON.stringify(direcciones));
    form.reset();
    renderLista();
  });

  function renderLista() {
    lista.innerHTML = "";
    if (direcciones.length === 0) {
      lista.innerHTML = `<li class="list-group-item">No tienes direcciones guardadas.</li>`;
      return;
    }

    direcciones.forEach((d) => {
      const item = document.createElement("li");
      item.className =
        "list-group-item d-flex justify-content-between align-items-start";
      item.innerHTML = `
        <div>
          <strong>${d.nombre}</strong><br>
          ${d.calle}, ${d.colonia}, ${d.ciudad}, ${d.estado}, CP ${d.cp}
        </div>
        <div>
          <button class="btn btn-sm btn-pink me-2" data-id="${d.id}" data-action="editar">Editar</button>
          <button class="btn btn-sm btn-pink" data-id="${d.id}" data-action="eliminar">Eliminar</button>
        </div>
      `;
      lista.appendChild(item);
    });

    lista.querySelectorAll("button").forEach((btn) => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;

      btn.addEventListener("click", () => {
        if (action === "eliminar") {
          direcciones = direcciones.filter((d) => d.id !== id);
          localStorage.setItem(storageKey, JSON.stringify(direcciones));
          renderLista();
        } else if (action === "editar") {
          const dir = direcciones.find((d) => d.id === id);
          if (dir) {
            document.getElementById("nombreDireccion").value = dir.nombre;
            document.getElementById("calle").value = dir.calle;
            document.getElementById("colonia").value = dir.colonia;
            document.getElementById("ciudad").value = dir.ciudad;
            document.getElementById("estado").value = dir.estado;
            document.getElementById("codigoPostal").value = dir.cp;

            direcciones = direcciones.filter((d) => d.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(direcciones));
            renderLista();
          }
        }
      });
    });
  }
}
