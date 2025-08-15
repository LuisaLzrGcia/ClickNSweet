import fetchData from "../fetchData/fetchData.js";
import { renderDashboardProducts } from "./renderDashboardProducts.js";
import { setupDeleteButtons } from "./setupDeleteButton.js";
import { setupEditButtons } from "./setupEditButtons.js";
import { switchControl } from "./switchControl.js";
import { renderStars } from "../functions/renderStars.js";


let products = []; // ahora esta lista viene del BackEnd

document.addEventListener("DOMContentLoaded", function () {
  getProducts();           // carga inicial
  // Los siguientes se re-enganchan después de cada render (ver renderList)
  console.log("Cargando productos desde el BackEnd…");
});

// ---------- Adaptador: BackEnd -> UI ----------
function adaptProductForUI(p) {
  const price = Number(p.price ?? p.pricing ?? 0);
  const discountVal = Number(p.discountValue ?? p.discount ?? 0);
  const priceDiscount = discountVal ? price * (1 - discountVal / 100) : price;
  const ratingRaw = p.averageRating ?? p.avgRating ?? p.rating ?? p.stars ?? p.score ?? 0;
  const rating = Math.max(0, Math.min(5, Number(ratingRaw)));

  return {
    id: p.id ?? p.productId,
    name: p.productName ?? p.name ?? "—",
    pricing: price,                    // tu UI usa 'pricing'
    discount: discountVal,             // tu UI espera porcentaje
    price_discount: priceDiscount,     // tu UI usa 'price_discount'
    rating,
    picture: p.picture ?? "",
    image: p.image ?? null,                            // <- base64 desde el back (byte[])
    imageMimeType: p.imageMimeType ?? p.imageType ?? "image/jpeg",

    category: p.productCategoryId?.name ?? p.category?.name ?? "—",
    country: p.productCountryId?.name ?? p.country ?? "—",

    // ‘stock’ es boolean en tu UI; si tienes quantityStock úsalo, si no, deriva de status
    stock: (p.quantityStock ?? null) !== null ? Number(p.quantityStock) > 0 : !!(p.status ?? true),

    // ‘status’ en tu UI es string: "" (activo) o "inactive"
    status: p.status ? "" : "inactive",

    description: p.description ?? "",
  };
}

// ---------- Render helper (pinta y re-engancha handlers) ----------
function renderList(list) {
  const container = document.getElementById("dashboard-products");
  if (!container) return;
  container.innerHTML = renderDashboardProducts(list);

  // Re-enganchar porque el DOM se reemplaza en cada render:
  switchControl();
  setupEditButtons();
  setupDeleteButtons();
}

// ---------- Carga desde BackEnd (POST /products o GET /products) ----------
const getProducts = async () => {
  const container = document.getElementById("dashboard-products");
  if (!container) return;

  try {
    // Preferimos POST /products (paginado). 
    const body = { page: 0, size: 50 };
    const resp = await fetchData("/products", "POST", {}, body);
    const arr = Array.isArray(resp?.items) ? resp.items : Array.isArray(resp) ? resp : [];
    products = arr.map(adaptProductForUI);
  } catch {
    try {
      const list = await fetchData("/products", "GET");
      products = (Array.isArray(list) ? list : []).map(adaptProductForUI);
    } catch (err) {
      console.error("Error cargando productos:", err);
      container.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
      return;
    }
  }

  renderList(products);
  console.log(products);
};

// ---------- Ordenamientos  ----------
document.getElementById("sort-new")?.addEventListener("click", () => {
  renderList([...products].reverse());
});

document.getElementById("sort-price-asc")?.addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => a.price_discount - b.price_discount);
  renderList(sorted);
});

document.getElementById("sort-price-desc")?.addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => b.price_discount - a.price_discount);
  renderList(sorted);
});

document.getElementById("sort-rating")?.addEventListener("click", () => {
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  renderList(sorted);
});

