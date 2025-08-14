async function fetchData(url, method = "GET", params = {}, body = null) {
  const api = "http://localhost:8080/api/v1/clicknsweet"; // Cambia esto por tu URL base real
  try {
    // Construir query string si hay parámetros
    let queryString = "";
    if (params && Object.keys(params).length > 0) {
      queryString = "?" + new URLSearchParams(params).toString();
    }

    // Configuración base
    const options = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Agregar body si no es GET y hay datos
    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    // Hacer la solicitud
    const response = await fetch(api + url + queryString, options);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
  let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
  try {
    const errorBody = await response.json();
    if (errorBody.message) {
      errorMessage = errorBody.message;
    }
  } catch (e) {
    // Si no se puede parsear, se mantiene el mensaje por defecto
  }
  throw new Error(errorMessage);
}
    const contentType = response.headers.get("content-type");
    if (
      response.status === 204 ||
      !contentType ||
      !contentType.includes("application/json")
    ) {
      return null;
    }

    // Intentar parsear la respuesta como JSON
    return await response.json();
  } catch (error) {
    console.error("Error en fetchData:", error);
    throw error;
  }
}
export default fetchData;
