const express = require("express")

const data = require("../data/data")
const pointsService = require("../services/pointsService");

const router = express.Router();

const service = new pointsService(data.points);

router.get('/', (req, res) => {
  const points = service.getAll();
  res.status(200).json(points);
})

router.post('/', (req, res) => {
  const { name, description, lat, lng } = req.body;
  service.create(name, description, lat, lng);
  res.status(201).json({ message: 'Point created' });
})

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, lat, lng } = req.body;
  const point = service.update(id, name, description, lat, lng);
  if (point) {
    res.status(200).json({ message: 'Point updated' });
  } else {
    res.status(404).json({ message: 'Point not found' });
  }
})

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const point = service.delete(id);
  if (point) {
    res.status(200).json({ message: 'Point deleted' });
  } else {
    res.status(404).json({ message: 'Point not found' });
  }
})

module.exports = router;