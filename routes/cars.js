import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get all cars
router.get('/', (req, res) => {
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

export default router;