import fetchData from "./fetchData.js";

export async function getCountriesData() {

    try {
        const data = await fetchData(`/countries`, 'GET', {}, null);
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Error de conexión con la API");
    }
}