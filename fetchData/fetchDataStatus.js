async function fetchDataStatus(url, method = 'GET', params, body) {
    const api = 'http://98.82.183.146/api/v1/clicknsweet'; // Cambia esto por tu URL base real
    try {
        // Construir query string si hay parámetros
        let queryString = '';
        if (params && Object.keys(params).length > 0) {
            queryString = '?' + new URLSearchParams(params).toString();
        }

        // Configuración base
        const options = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Agregar body si no es GET y hay datos
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        // Hacer la solicitud
        const response = await fetch(api + url + queryString, options);

        // Verificar si la respuesta es exitosa
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }


        // Intentar parsear la respuesta como JSON
        return await response;

    } catch (error) {
        console.error('Error en fetchData:', error);
        throw error;
    }
}
export default fetchDataStatus;