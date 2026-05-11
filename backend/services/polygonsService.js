class polygonsService {
  constructor(polygons) {
    this.polygons = polygons;
  }

  getAll() {
    return this.polygons;
  }

  create(data) {
    const newPolygon = {
      id: this.polygons.length + 1,
      ...data,
      active: true
    }
    this.polygons.push(newPolygon);
    return newPolygon;
  }

  update(id, changes) {
    const index = this.polygons.findIndex(item => item.id == id);
    if (index == -1) return null;
    const polygon = this.polygons[index];
    this.polygons[index] = { ...polygon, ...changes };
    return this.polygons[index];
  }

  delete(id) {
    const index = this.polygons.findIndex(item => item.id == id);
    if (index == -1) return null;
    this.polygons[index].active = false;
    return this.polygons[index];
  }
}

module.exports = polygonsService