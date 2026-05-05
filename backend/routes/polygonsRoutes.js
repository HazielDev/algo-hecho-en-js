const express = require("express");
const data = require("../data/data");
const polygonsService = require("../services/polygonsService");

const router = express.Router();

const service = new polygonsService(data.polygons);

router.get('/', (req, res) => {
  const polygons = service.getAll();
  res.status(200).json(polygons);
})

router.post('/', (req, res) => {
  const { name, coordinates } = req.body;
  service.create(name, coordinates);
  res.status(201).json({ message: 'Polygon created' });
})

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, coordinates } = req.body;
  const polygon = service.update(id, name, coordinates);
  if (polygon) {
    res.status(200).json({ message: 'Polygon updated' });
  } else {
    res.status(404).json({ message: 'Polygon not found' });
  }
})

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const polygon = service.delete(id);
  if (polygon) {
    res.status(200).json({ message: 'Polygon deleted' });
  } else {
    res.status(404).json({ message: 'Polygon not found' });
  }
})

module.exports = router;