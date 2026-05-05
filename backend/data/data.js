class data{
  constructor() {
    this.points = [];
    this.routes_lines = [];
    this.polygons = [];

    this.generate();
  }

  generate() {
    const new_points = [
      {
        "name": "Casa Benito",
        "description": "La casa del buen Benito",
        "lat": 21.155087705821174, 
        "lng": -101.68840950251052
      },
      {
        
      }
    ]

    this.points.push(...new_points);
  }
}

module.exports = data;