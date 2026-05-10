import { API_URL } from "./config";

export async function getPoints() {
  try {
    const response = await fetch(`${API_URL}/points`)
    if (!response.ok) {
      throw new Error('Error al obtener los puntos')
    }
    const data = await response.json()
    return data;
  } catch (error) {
    console.error('Error en getPoints: ', error)
    return [];
  }
}

export async function createPoint(pointData) {
  try {
    const response = await fetch(`${API_URL}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pointData)
    })
    if (!response.ok) {
      throw new Error('Error al crear el punto')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createPoint: ', error)
    throw error;
  }
}

export async function updatePoint(id, pointData) {
  try {
    const response = await fetch(`${API_URL}/points/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pointData)
    })
    if (!response.ok) {
      throw new Error('Error al actualizar el punto')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updatePoint: ', error)
    throw error;
  }
}

export async function deletePoint(id) {
  try {
    const response = await fetch(`${API_URL}/points/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Error al eliminar el punto')
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deletePoint: ', error)
    throw error;
  }
}