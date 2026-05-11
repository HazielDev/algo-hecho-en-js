class routesLinesService {
  constructor(routesLines) {
    this.routesLines = routesLines;
  }

  getAll() {
    return this.routesLines;
  }

  create(data) {
    const newRoute = {
      id: this.routesLines.length + 1,
      ...data,
      active: true
    }
    this.routesLines.push(newRoute);
    return newRoute;
  }

  update(id, changes) {
    const index = this.routesLines.findIndex(item => item.id == id);
    if (index == -1) return null;
    const route = this.routesLines[index];
    this.routesLines[index] = { ...route, ...changes };
    return this.routesLines[index];
  }

  delete(id) {
    const index = this.routesLines.findIndex(item => item.id == id);
    if (index == -1) return null;
    this.routesLines[index].active = false;
    return this.routesLines[index];
  }
}

module.exports = routesLinesService