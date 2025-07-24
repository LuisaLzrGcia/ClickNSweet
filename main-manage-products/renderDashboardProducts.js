import { renderStars } from "../functions/renderStars.js";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
}

export function renderDashboardProducts(productsArray) {
  let html = "";
  productsArray.forEach((product) => {
    const priceFormat = product.pricing.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    const discountFormat = product.price_discount.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    // html += `
    // <div class="col-12">
    //   <div class="card shadow-sm p-3 border-0 rounded-4">
    //     <div class="row g-3 align-items-center">
    //       <div class="col-md-4">
    //         <img src="${product.picture}" class="img-fluid rounded-4 object-fit-cover w-100 h-100" style="max-height: 200px;" alt="${product.name}">
    //       </div>
    //       <div class="col-md-8">
    //         <div class="d-flex justify-content-between align-items-start mb-2">
    //           <span class="badge bg-info text-dark">${product.category}</span>
    //           <small class="text-muted">${product.country}</small>
    //         </div>
    //         <div class="d-flex justify-content-between align-items-center mb-2">
    //           <p class="mb-0">
    //             Estatus <span class="text-success fw-semibold">Activo <i class="bi bi-patch-check-fill"></i></span>
    //           </p>
    //           <p class="mb-0 text-end">Unidades en stock <strong>${product.stock}</strong></p>
    //         </div>

    //         <div class="d-flex justify-content-between align-items-center mb-2">
    //           <h5 class="card-title mb-0">${product.name}</h5>
    //           <div class="d-flex align-items-center">
    //             <div class="text-warning me-1">
    //               ${renderStars(product.rating)}
    //             </div>
    //             <small class="text-muted">${product.rating.toFixed(1)}</small>
    //           </div>
    //         </div>
    //         <p class="text-muted mb-3">${product.description}</p>
    //         <div class="row text-center mb-3">
    //           <div class="col">
    //             <div class="bg-info bg-opacity-25 p-2 rounded-3 fw-bold">Precio<br><span class="text-dark">${priceFormat}</span></div>
    //           </div>
    //           <div class="col">
    //             <div class="bg-info bg-opacity-25 p-2 rounded-3 fw-bold">Descuento<br><span class="text-dark">${product.discount}%</span></div>
    //           </div>
    //           <div class="col">
    //             <div class="bg-primary bg-opacity-25 p-2 rounded-3 fw-bold">Precio final<br><span class="text-dark">${discountFormat}</span></div>
    //           </div>
    //         </div>
    //         <div class="buttons-admin-products d-flex gap-2 flex-wrap">
    //           <button class="btn btn-sm btn-pink"><i class="bi bi-pencil-fill me-1"></i>Editar</button>
    //           <button class="btn btn-sm btn-danger"><i class="bi bi-trash-fill me-1"></i>Borrar</button>
    //           <div class="form-check form-switch ms-auto">
    //             <input class="form-check-input" type="checkbox" id="toggle-${product.id}" checked>
    //             <label class="form-check-label" for="toggle-${product.id}">Desactivar</label>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    // `;
    //   html += `
    //   <div class="col-12">
    //     <div class="card shadow-sm p-3 border-0 rounded-4 h-100 product-card">
    //       <div class="row g-3 align-items-center h-100">
    //         <!-- Sección de imagen -->
    //         <div class="col-md-4">
    //           <div class="position-relative h-100">
    //             <img src="${product.picture}"
    //                 class="img-fluid rounded-4 object-fit-cover w-100 h-100 product-image"
    //                 style="min-height: 200px; max-height: 250px;"
    //                 alt="${product.name}"
    //                 loading="lazy">
    //             <!-- Badge de descuento -->
    //             ${
    //               product.discount > 0
    //                 ? `
    //               <span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end"
    //                     style="font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    //                 -${product.discount}% OFF
    //               </span>
    //             `
    //                 : ""
    //             }
    //           </div>
    //         </div>

    //         <!-- Sección de contenido -->
    //         <div class="col-md-8">
    //           <!-- Encabezado -->
    //           <div class="d-flex justify-content-between align-items-start mb-3">
    //             <span class="badge bg-info text-dark text-uppercase fs-xxs">${product.category}</span>
    //             <div class="d-flex align-items-center">
    //               <i class="bi bi-geo-alt-fill text-muted me-1"></i>
    //               <small class="text-muted">${product.country}</small>
    //             </div>
    //           </div>

    //           <!-- Estado y stock -->
    //           <div class="d-flex justify-content-between align-items-center mb-3">
    //             <span class="d-flex align-items-center">
    //               <span class="status-indicator bg-success me-2"></span>
    //               <span class="text-success fw-semibold">Activo</span>
    //               <i class="bi bi-patch-check-fill text-success ms-1"></i>
    //             </span>
    //             <span class="d-flex align-items-center">
    //               <i class="bi bi-box-seam text-muted me-2"></i>
    //               <span class="text-muted">Disponibles:</span>
    //               <strong class="ms-1">${product.stock}</strong>
    //             </span>
    //           </div>

    //           <!-- Nombre y rating -->
    //           <div class="d-flex justify-content-between align-items-center mb-3">
    //             <h3 class="h5 card-title mb-0 text-truncate" title="${product.name}">${product.name}</h3>
    //             <div class="d-flex align-items-center bg-light px-2 py-1 rounded-pill">
    //               <div class="text-warning me-1">
    //                 ${renderStars(product.rating)}
    //               </div>
    //               <small class="text-muted fw-bold">${product.rating.toFixed(1)}</small>
    //             </div>
    //           </div>

    //           <!-- Descripción -->
    //           <p class="text-muted mb-4 product-description">${product.description}</p>

    //           <!-- Precios -->
    //           <div class="row g-2 mb-4">
    //             <div class="col-md-4">
    //               <div class="bg-light p-3 rounded-3 h-100 d-flex flex-column">
    //                 <small class="text-muted mb-1">Precio regular</small>
    //                 <span class="text-dark fw-bold fs-5">${priceFormat}</span>
    //               </div>
    //             </div>
    //             <div class="col-md-4">
    //               <div class="bg-light p-3 rounded-3 h-100 d-flex flex-column">
    //                 <small class="text-muted mb-1">Ahorras</small>
    //                 <span class="text-danger fw-bold fs-5">${product.discount}%</span>
    //               </div>
    //             </div>
    //             <div class="col-md-4">
    //               <div class="bg-primary bg-opacity-10 p-3 rounded-3 h-100 d-flex flex-column border border-primary border-opacity-25">
    //                 <small class="text-primary mb-1">Precio final</small>
    //                 <span class="text-dark fw-bold fs-5">${discountFormat}</span>
    //               </div>
    //             </div>
    //           </div>

    //           <!-- Acciones -->
    //           <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top">
    //             <div class="d-flex gap-2">
    //               <button class="btn btn-sm btn-outline-primary d-flex align-items-center edit-btn">
    //                 <i class="bi bi-pencil-fill me-1"></i>Editar
    //               </button>
    //               <button class="btn btn-sm btn-outline-danger d-flex align-items-center delete-btn">
    //                 <i class="bi bi-trash-fill me-1"></i>Borrar
    //               </button>
    //             </div>

    //             <div class="d-flex align-items-center ms-auto">
    //               <div class="form-check form-switch">
    //                 <input class="form-check-input" type="checkbox" id="toggle-${product.id}" checked
    //                       style="width: 2.5em; height: 1.3em;">
    //                 <label class="form-check-label small ms-2" for="toggle-${product.id}">Activo/Inactivo</label>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    // </div>
    //   `;
    html += `
  <div class="col-12">
  <div class="card shadow-sm p-3 border-0 rounded-4 h-100 product-card">
    <div class="row g-3 align-items-center h-100">
      <!-- Sección de imagen -->
      <div class="col-md-4">
        <div class="position-relative h-100">
          <img src="${product.picture}" 
               class="img-fluid rounded-4 object-fit-cover w-100 h-100 product-image" 
               style="min-height: 200px; max-height: 250px;" 
               alt="${product.name}"
               loading="lazy">
          <!-- Badge de descuento -->
          ${
            product.discount > 0
              ? `
            <span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end" 
                  style="font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              -${product.discount}% OFF
            </span>
          `
              : ""
          }
          <!-- Badge especial para admin -->
          <span class="position-absolute bottom-0 start-0 bg-dark text-white px-2 py-1 rounded-top-end" 
                style="font-size: 0.8rem;">
            <i class="bi bi-shield-lock me-1"></i>Admin Mode
          </span>
        </div>
      </div>

      <!-- Sección de contenido -->
      <div class="col-md-8">
        <!-- Encabezado -->
        <div class="d-flex flex-wrap justify-content-between align-items-start mb-2 gap-2">
          <span class="category badge text-dark text-uppercase fs-xxs">${product.category}</span>
          <div class="d-flex align-items-center pe-2">
            <i class="bi bi-geo-alt-fill text-muted me-1"></i>
            <small class="text-muted">${product.country}</small>
          </div>
        </div>

        <!-- Estado y stock - Versión mejorada para admin -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-1 gap-2">
          <div class="d-flex align-items-center">
            <span class="text-success fw-semibold">Activo</span>
            <i class="bi bi-patch-check-fill text-success ms-1"></i>
          </div>
          <div class="d-flex align-items-center px-2 py-1 rounded-pill">
            <i class="bi bi-box-seam text-muted me-2"></i>
            <span class="text-muted me-1">Stock:</span>
            <strong class="text-dark">${product.stock}</strong>
          </div>
        </div>

        <!-- Nombre y rating - Solución para el problema de las estrellas -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
          <h3 class="h5 card-title mb-0 text-truncate flex-grow-1 pe-2" style="max-width: 70%;" title="${product.name}">
            ${product.name}
          </h3>
          <div class="d-flex align-items-center px-2 py-1 rounded-pill rating-container">
            <div class="text-warning me-1">
              ${renderStars(product.rating)}
            </div>
            <small class="text-muted fw-bold">${product.rating.toFixed(1)}</small>
          </div>
        </div>

        <!-- Descripción -->
        <p class="text-muted mb-4 product-description">${product.description}</p>

        <!-- Precios - Versión mejorada para admin -->
        <div class="row g-2 mb-4">
          <div class="col-md-4">
            <div class="precio p-3 rounded-3 h-100 d-flex flex-column">
              <small class="text-muted mb-1">Precio base</small>
              <span class="text-dark fw-bold fs-5">${priceFormat}</span>
              <small class="text-muted mt-1">Costo: $${(product.pricing * 0.7).toFixed(2)}</small>
            </div>
          </div>
          <div class="col-md-4">
            <div class="precio p-3 rounded-3 h-100 d-flex flex-column">
              <small class="text-muted mb-1">Margen</small>
              <span class="text-success fw-bold fs-5">$${(product.pricing * 0.3).toFixed(2)} (30%)</span>
              <small class="text-muted mt-1">Descuento: ${product.discount}%</small>
            </div>
          </div>
          <div class="col-md-4">
            <div class="precio p-3 rounded-3 h-100 d-flex flex-column border border-primary border-opacity-25">
              <small class="text-primary mb-1">Precio final</small>
              <span class="text-dark fw-bold fs-5">${discountFormat}</span>
              <small class="text-success mt-1">Ganancia: $${(product.pricing * 0.3 * (1 - product.discount / 100)).toFixed(2)}</small>
            </div>
          </div>
        </div>

        <!-- Acciones administrativas mejoradas -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top buttons-admin-dashboard">
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-pink d-flex align-items-center me-3">
              <i class="bi bi-pencil-fill me-1"></i>Editar
            </button>
            <div class="form-check form-switch d-flex align-items-center">
              <input class="form-check-input" type="checkbox" id="toggle-${product.id}" checked 
                     style="width: 2.5em; height: 1.3em;">
              <label class="form-check-label small ms-2" for="toggle-${product.id}">Activo</label>
            </div>
            
          </div>
          
          <div class="d-flex align-items-center ms-auto gap-2">
            <button class="btn btn-sm d-flex align-items-center btn-eliminar">
              <i class="bi bi-trash-fill me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
  });
  return html;
}
