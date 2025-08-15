import fetchData from "./fetchData.js";

export async function getCategoriesData(httpMethod, id, params, body) {

    try {
        const data = await fetchData(`/categories${id > 0 ? "/" + id : ""}`, httpMethod, params, body);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error de conexión con la API");
    }
}