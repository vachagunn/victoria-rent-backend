import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { sampleCars } from './utils/data.js';

// Получение абсолютного пути текущего файла и директории проекта
// fileURLToPath преобразует URL-адрес файла в путь к файловой системе, например, file:///path/to/file в /path/to/file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Определение полного пути к файлу БД
const dbPath = join(__dirname, 'cars-rent.db');

// Создание подключения к БД sqlite3
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening detabase: ', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Логирование путей для проверки правильности конфигурации
console.log('DIRNAME: ', __dirname);
console.log('FILENAME: ', __filename);
console.log('DB_PATH:', dbPath);

// Функция для инициализации структуры БД
export const initDatabase = () => {
    
    // Создание таблицы cars
    db.run(`CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Уникальный идентификатор автомобиля
        name TEXT NOT NULL,                             -- Название модели автомобиля
        segment TEXT NOT NULL,                          -- Класс автомобиля (эконом/комфорт/комфорт+/бизнес/грузовой)
        price INTEGER NOT NULL,                         -- Цена аренды авто
        image TEXT NOT NULL,                            -- Путь к изображению автомобиля
        engine TEXT NOT NULL,                           -- Тип литраж двигателя
        transmission TEXT NOT NULL,                     -- Трансмиссия (МКПП/АКПП)
        drive TEXT NOT NULL,                            -- Привод (полный/задний/передний)
        year INTEGER NOT NULL,                          -- Год выпуска автомобиля
        available BOOLEAN DEFAULT 1,                    -- Доступность автомобиля (доступен/занят)
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- Дата добавления автомобиля в БД
    )`);

    /**
     * Создание таблицы orders
     * Связана с таблицей cars через внешний ключ car_id
     */
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,           -- Идентификатор заявки
        car_id INTEGER NOT NULL,                        -- ID арендуемого автомобиля
        car_name TEXT NOT NULL,                         -- Название арендуемого автомобиля
        customer_name TEXT NOT NULL,                    -- Имя клиента
        customer_phone TEXT NOT NULL,                   -- Телефон клиента
        customer_email TEXT NOT NULL,                   -- Email клиента
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Время оформления заявки
        FOREIGN KEY (car_id) REFERENCES cars (id)       -- Внешний ключ к таблице cars
    )`);

    // Проверка наличие записей в таблице cars 
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

/**
 * Функция для вставки тестовых данных в таблицу cars
 */
const insertSampleData = () => {
    const insertCar = db.prepare(`
        INSERT INTO cars (
            name, segment, price, image, engine, transmission, drive, year, available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Добавление данных из массива sampleCars
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
