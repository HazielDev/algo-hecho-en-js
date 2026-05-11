/**
 * pointsService.js (Frontend): Módulo de comunicación con la API para Puntos.
 * Centraliza todas las peticiones fetch para mantener el código limpio.
 */
import { API_URL } from './config';

/**
 * Obtiene todos los puntos desde el servidor.
 * @returns {Promise<Array>} Lista de puntos
 */
export async function getPoints() {
  const response = await fetch(`${API_URL}/points`);
  if (!response.ok) throw new Error('No se pudieron cargar los puntos');
  return response.json();
}

/**
 * Crea un nuevo registro de punto en la base de datos.
 * @param {Object} data - Datos del punto {name, description, lat, lng, category}
 */
export async function createPoint(data) {
  const { id, active, ...rest } = data; // Excluir id y active
  const response = await fetch(`${API_URL}/points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest)
  });
  if (!response.ok) throw new Error('Error al crear el punto');
  return response.json();
}

/**
 * Actualiza parcialmente un punto existente.
 * @param {number|string} id - ID del punto
 * @param {Object} data - Cambios a aplicar
 */
export async function updatePoint(id, data) {
  const response = await fetch(`${API_URL}/points/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar el punto');
  return response.json();
}

/**
 * Elimina un punto mediante su ID.
 */
export async function deletePoint(id) {
  const response = await fetch(`${API_URL}/points/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al borrar el punto');
  return true;
}