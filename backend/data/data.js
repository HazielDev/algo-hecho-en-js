class data{
  constructor() {
    this.points = [];
    this.routesLines = [];
    this.polygons = [];

    this.generate();
  }

  generate() {
    const new_points = [
      {
        "id":1,
        "name": "Casa Benito",
        "description": "La casa del buen Benito",
        "lat": 21.155087705821174, 
        "lng": -101.68840950251052
      },
      {
        "id":2,
        "name": "Casa de Pablo",
        "description": "La casa del Pablo Emilio Escobar Gaviria",
        "lat": 21.131415544339916, 
        "lng":-101.61574087183952
      },
      {
        "id":3,
        "name": "Universidad la Salle",
        "description": "La universidad la salle bajío campus campestre",
        "lat": 21.152378563644284, 
        "lng": -101.71140343436767
      },
      {
        "id":4,
        "name": "Altacia",
        "description": "Centro Comercial Altacia",
        "lat": 21.092868090610075, 
        "lng":-101.62609468189275
      },
      {
        "id":5,
        "name": "Plaza Mayor",
        "description": "Centro Comercial Plaza Mayor",
        "lat": 21.157906789447114, 
        "lng": -101.69518067506645
      }
    ]

    const new_routes_lines = [
      {
        "id": 1,
        "name": "Ruta de casa Pablo a casa Benito",
        "coordinates": [
          { "lat": 21.131415544339916, "lng":-101.61574087183952 },
          { "lat": 21.131207599392308, "lng":-101.61580426173174 },
          { "lat": 21.130973854244953, "lng":-101.61600326419112 },
          { "lat": 21.130473854244953, "lng":-101.61600326419112 }
        ]
      },
      {
        "id": 2,
        "name": "Metropolitano a la Feria",
        "coordinates": [
          { "lat": 21.17279313758006, "lng":-101.68676590102586 },
          { "lat": 21.16990022333479, "lng": -101.68599005122115 }
        ]
      }
    ]

    const new_polygons = [
      {
        "id": 1,
        "name": "Costco Plaza Mayor",
        "coordinates": [
          { "lat": 21.15876187355741, "lng": -101.69889428535279 },
          { "lat": 21.15876187355741, "lng": -101.69647508980771 }
        ]
      },
      {
        "id": 2,
        "name": "Universidad La Salle Bajio Campestre",
        "coordinates": [
          { "lat": 21.152378563644284, "lng": -101.71140343436767 },
          { "lat": 21.152378563644284, "lng": -101.71140343436767 }
        ]
      },
      {
        "id": 3,
        "name": "Estadio León",
        "coordinates": [
          { "lat": 21.126074630716508, "lng": -101.65694627979624 },
          { "lat": 21.126074630716508, "lng": -101.65694627979624 },
          { "lat": 21.126074630716508, "lng": -101.65694627979624 },
          { "lat": 21.126074630716508, "lng": -101.65694627979624 }
        ]
      }
    ]

    this.points.push(...new_points);
    this.routesLines.push(...new_routes_lines);
    this.polygons.push(...new_polygons);
  }
}

module.exports = data;