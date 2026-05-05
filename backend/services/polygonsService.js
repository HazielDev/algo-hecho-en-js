class polygonsService {
  constructor(polygons) {
    this.polygons = polygons;
  }

  getAll() {
    return this.polygons;
  }

  create(name, coordinates) {
    const newPolygon = {
      id: this.polygons.length + 1,
      name,
      coordinates
    }
    this.polygons.push(newPolygon);
  }

  update(id, name, coordinates) {
    const index = this.polygons.findIndex(item => item.id == id);
    if (index == -1) return null;
    const polygon = this.polygons[index];
    polygon.name = name || polygon.name;
    polygon.coordinates = coordinates || polygon.coordinates;
    return polygon;
  }

  delete(id) {
    const index = this.polygons.findIndex(item => item.id == id);
    if (index == -1) return null;
    this.polygons.splice(index, 1);
    return true;
  }
}

module.exports = polygonsService