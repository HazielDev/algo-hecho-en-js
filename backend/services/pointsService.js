class pointsService {
  constructor(points) {
    this.points = points;
  }

  getAll() {
    return this.points;
  }

  create(name, description, lat, lng) {
    const new_point = {
      id: this.points.length + 1,
      name,
      description,
      lat,
      lng
    }
    this.points.push(new_point)
  }

  update(id, name, description, lat, lng) {
    const index = this.points.findIndex(item => item.id == id);
    if (index == -1) return null;
    const point = this.points[index];
    point.name = name || point.name;
    point.description = description || point.description;
    point.lat = lat || point.lat;
    point.lng = lng || point.lng;
    return point;
  }

  delete(id) {
    const index = this.points.findIndex(item => item.id == id);
    if (index == -1) return null;
    this.points.splice(index, 1);
    return true;
  }
}

module.exports = pointsService;
