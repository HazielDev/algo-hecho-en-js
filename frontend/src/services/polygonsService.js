import { API_URL } from "./config";

export async function getPolygons() {
  try {
    const response = await fetch(`${API_URL}/polygons`)
    if (!response.ok) {
      throw new Error('Error al obtener los polígonos')
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.error('Error en getPolygons: ', error)
    return [];
  }
}

export async function createPolygon(polygonData) {
  try {
    const { id, active, ...rest } = polygonData; // Excluir id y active
    const response = await fetch(`${API_URL}/polygons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rest)
    })
    if (!response.ok) {
      throw new Error('Error al crear el polígono')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createPolygon: ', error)
    throw error;
  }
}

export async function updatePolygon(id, polygonData) {
  try {
    const response = await fetch(`${API_URL}/polygons/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(polygonData)
    })
    if (!response.ok) {
      throw new Error('Error al actualizar el polígono')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updatePolygon: ', error)
    throw error;
  }
}

export async function deletePolygon(id) {
  try {
    const response = await fetch(`${API_URL}/polygons/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error al eliminar el polígono')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deletePolygon: ', error)
    throw error;
  }
}
