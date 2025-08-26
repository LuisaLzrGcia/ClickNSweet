async function fetchData(url, method = "GET", params, body) {
  if (!url) return;

  const api = "http://98.82.183.146/api/v1/clicknsweet";

  try {
    let queryString = "";
    if (params && Object.keys(params).length > 0) {
      queryString = "?" + new URLSearchParams(params).toString();
    }

    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(api + url + queryString, options);

    // ✅ Permitir 200, 201 y 204 como respuestas correctas
    if (![200, 201, 204].includes(response.status)) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    // ✅ Si es 204, no hay contenido
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchData:", error);
    throw error;
  }
}
export default fetchData;
