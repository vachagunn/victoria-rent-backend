import express from 'express';
import { db } from '../database.js';

const carRoutes = express.Router();

// Get all cars
carRoutes.get('/', (req, res) => {
    const { segment: carSegment } = req.query;
    
    let query = 'SELECT * FROM cars WHERE available = 1';
    const params = [];

    if (carSegment && carSegment !== 'все') {
        query += ' AND segment = ?';
        params.push(carSegment);
    }

    query += ' ORDER BY name';

    db.all(query, params, (err, cars) => {
        if (err) {
            console.error('Error fetching cars: ', err);
            return res.status(500).json({ error: 'Database error'});
        }
        res.json(cars);
    });
});

carRoutes.get('/:id', (req, res) => {
    const carId = req.params.id;

    db.get('SELECT * FROM cars WHERE id = ?', [carId], (err, car) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(car);
    });
});

export default carRoutes;