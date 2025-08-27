import fetchData from "../fetchData/fetchData.js";

// export async function getProductsData({ page = 0, size = 6, name = null, minPrice = null, maxPrice = null, status = "ACTIVE", averageRating = null, country = null, categoryId = null } = {}) {
//  const body = {
//    page: page,  // backend 0-based
//    size: size,
//    name: name,
//    minPrice: minPrice,
//    maxPrice: maxPrice,
//    status: status,
//    averageRating: averageRating,
//    country: country,
//    categoryId: categoryId
//  };


 // const params = {};

//  try {
//    const data = await fetchData('/products', 'POST', params, body);
//    return data;
//  } catch (error) {
//    console.error(error);
//    throw new Error("Error de conexión con la API");
//  }
//}

// -------- Parte de los ultimos cambios -------- // 
export async function getProductsData({
  page = 0, size = 6, name = null,
  minPrice = null, maxPrice = null, status = null, averageRating = null,
  countryId = null, categoryId = null
} = {}) {
  const body = {
    page, size, name,
    minPrice, maxPrice, status, averageRating,
    countryId,     // 👈 NUEVO
    categoryId
  };

  const params = {};
  try {
    const data = await fetchData('/products', 'POST', params, body);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error de conexión con la API");
  }
}
