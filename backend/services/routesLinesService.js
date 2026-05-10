class routesLinesService {
  constructor(routesLines) {
    this.routesLines = routesLines;
  }

  getAll() {
    return this.routesLines;
  }

  create(name, coordinates) {
    const newRoute = {
      id: this.routesLines.length + 1,
      name,
      coordinates,
      active: true
    }
    this.routesLines.push(newRoute);
  }

  update(id, name, coordinates) {
    const index = this.routesLines.findIndex(item => item.id == id);
    if (index == -1) return null;
    const route = this.routesLines[index];
    route.name = name ?? route.name;
    route.coordinates = coordinates ?? route.coordinates;
    return route;
  }

  delete(id) {
    const index = this.routesLines.findIndex(item => item.id == id);
    if (index == -1) return null;
    this.routesLines[index].active = !this.routesLines[index].active;
    return this.routesLines[index];
  }
}

module.exports = routesLinesService