class PointsService {
  constructor(points) {
    this.points = points;
  }

  /**
   * Devuelve el arreglo de puntos.
   */
  async find() {
    return this.points;
  }

  /**
   * Inserta un nuevo punto asignándole un ID único basado en el tamaño del arreglo.
   */
  async create(data) {
    const newPoint = {
      id: this.points.length + 1,
      ...data,
      active: true
    };
    this.points.push(newPoint);
    return newPoint;
  }

  /**
   * Actualiza un punto existente mediante su ID.
   */
  async update(id, changes) {
    const index = this.points.findIndex(item => item.id == id);
    if (index === -1) throw new Error('Punto no encontrado');
    
    const point = this.points[index];
    this.points[index] = { ...point, ...changes };
    return this.points[index];
  }

  /**
   * Elimina un punto del arreglo basándose en su ID.
   */
  async delete(id) {
    const index = this.points.findIndex(item => item.id == id);
    if (index === -1) throw new Error('Punto no encontrado');
    
    this.points[index].active = false;
    return this.points[index];
  }
}

module.exports = PointsService;

