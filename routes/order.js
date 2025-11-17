import express from 'express';
import { db } from '../database.js';
import { sendEmailNotification } from '../utils/email.js';
import util from 'util';

const orderRoutes = express.Router();
const runSql = util.promisify(db.run.bind(db));

orderRoutes.post('/', async (req, res) => {
    console.log('ORDER_BACKEND_REQ:', req);
    console.log('ORDER_BACKEND_RES', res);
    console.log('BODY: ', req.body);
    const cardId = req.body.cardId;
    console.log('CardID:', cardId);
    const carName = req.body.carName;
    console.log('CarName:', carName);
    const customerName = req.body.customerName;
    const customerPhone = req.body.customerPhone;
    const customerEmail = req.body.customerEmail;

    if (!cardId || !customerName || !customerPhone) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Проверяем наличие автомобиля
    const carExistsQuery = 'SELECT * FROM cars WHERE id = ?';
    let car;
    try {
        car = await db.get(carExistsQuery, [cardId]);
    } catch (err) {
        console.error('Error fetching car: ', err);
        return res.status(500).json({ error: 'Internal Server Errror '});
    }

    if (!car) {
        return res.status(404).json({ error: 'Car not found' });
    }

    const orderData = {
        car_id: cardId,
        car_name: carName,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null
    };

    const insertOrderData = `INSERT INTO orders (
        car_id, car_name, customer_name, customer_phone, customer_email
    ) VALUES (?, ?, ?, ?, ?)`;
    
    const orderDataArray = [
        orderData.car_id,
        orderData.car_name,
        orderData.customer_name,
        orderData.customer_phone,
        orderData.customer_email
    ];

    try {
        await runSql(insertOrderData, orderDataArray);

        const order = {
            id: db.lastID,
            ...orderData,
            status: 'new',
            created_at: new Date().toISOString()
        };

        if (customerEmail) {
            await sendEmailNotification(order);
        }

        res.status(201).json({
            message: 'Order created successfully',
            order: order
        });
    } catch (err) {
        console.error('Error creating order: ', err);
        res.status(500).json({ error: 'Failed to create order '});
    }
});

export default orderRoutes;