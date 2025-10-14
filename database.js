import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// fileURLToPath преобразует URL-адрес файла в путь к файловой системе, например, file:///path/to/file в /path/to/file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'cars-rent.db');

// Создание и конфигурация БД
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening detabase: ', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

console.log(__dirname);
console.log(__filename);
console.log(dbPath);

export const initDatabase = () => {
    db.run(`CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        segment TEXT NOT NULL,
        price INTEGER NOT NULL,
        image TEXT NOT NULL,
        engine TEXT NOT NULL,
        transmission TEXT NOT NULL,
        drive TEXT NOT NULL,
        year INTEGER NOT NULL,
        available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.get("SELECT COUNT(*) as count FROM cars", (err, row) => {
        if (err) {
            console.error('Error checking cars count: ', err);
            return;
        }

        if (row.count === 0) {
            insertSampleData();
        }
    });
};

// Insert sample car data
const insertSampleData = () => {
    const sampleCars = [
        {
            name: 'Kia Rio',
            segment: 'эконом',
            price: 1500,
            image: '/images/kia-rio.jpg',
            engine: '1.6 л',
            transmission: 'Автомат',
            drive: 'Передний',
            year: 2022,
            available: 1
        },
        {
            name: 'Hyundai Solaris',
            segment: 'эконом',
            price: 1600,
            image: '/images/hyundai-solaris.jpg',
            engine: '1.6 л',
            transmission: 'Автомат',
            drive: 'Передний',
            year: 2023,
            available: 1
        },
        {
            name: 'Geely Emgrand',
            segment: 'комфорт+',
            price: 1800,
            image: '/images/geely-emgrand.jpg',
            engine: '1.5 л',
            transmission: 'Автомат',
            drive: 'Передний',
            year: 2023,
            available: 1
        },
        {
            name: 'VW Polo',
            segment: 'комфорт',
            price: 2000,
            image: '/images/vw-polo.jpg',
            engine: '1.6 л',
            transmission: 'Автомат',
            drive: 'Передний',
            year: 2022,
            available: 1
        },
        {
            name: 'Haval Jolion',
            segment: 'комфорт+',
            price: 2500,
            image: '/images/haval-jolion.jpg',
            engine: '1.5 л',
            transmission: 'Автомат',
            drive: 'Передний',
            year: 2023,
            available: 1
        },
        {
            name: 'Lada Largus',
            segment: 'грузовой',
            price: 1700,
            image: '/images/lada-largus.jpg',
            engine: '1.6 л',
            transmission: 'Механика',
            drive: 'Передний',
            year: 2022,
            available: 1
        }
    ];

    const insertCar = db.prepare(`
        INSERT INTO cars (
            name, segment, price, image, engine, transmission, drive, year, available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleCars.forEach(car => {
        insertCar.run([
            car.name,
            car.segment,
            car.price,
            car.image,
            car.engine,
            car.transmission,
            car.drive,
            car.year,
            car.available
        ]);
    });

    insertCar.finalize();
    console.log('Sample data inserted successfully');
}
