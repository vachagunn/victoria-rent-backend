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