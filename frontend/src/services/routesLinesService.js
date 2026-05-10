import { API_URL } from "./config";

export async function getRoutesLines() {
  try {
    const response = await fetch(`${API_URL}/routes-lines`)
    if (!response.ok) {
      throw new Error('Error al obtener las rutas')
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.error('Error en getRoutesLines: ', error)
    return [];
  }
}

export async function createRouteLine(routeData) {
  try {
    const response = await fetch(`${API_URL}/routes-lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(routeData)
    })
    if (!response.ok) {
      throw new Error('Error al crear la ruta')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createRouteLine: ', error)
    throw error;
  }
}

export async function updateRouteLine(id, routeData) {
  try {
    const response = await fetch(`${API_URL}/routes-lines/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(routeData)
    })
    if (!response.ok) {
      throw new Error('Error al actualizar la ruta')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateRouteLine: ', error)
    throw error;
  }
}

export async function deleteRouteLine(id) {
  try {
    const response = await fetch(`${API_URL}/routes-lines/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error al eliminar la ruta')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deleteRouteLine: ', error)
    throw error;
  }
}
