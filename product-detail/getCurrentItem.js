import fetchData from "../fetchData/fetchData.js";

export async function getCurrentItem(id) {

  if (!id) { return }
  try {
    const data = await fetchData('/product/' + id, 'GET', {}, {});
    return data;
  } catch (error) {
    console.error(error);
    return null; // Para manejar el redireccionamiento si falla
  }
}