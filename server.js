import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Загружает переменные из файла .env в process.env (переменные окружения).
// Хранение конфиденциальных данных (API ключи) вне кодовой базы и использование их в приложении.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// cors как промежуточное ПО (для разрешения доступа со всех источников)
app.use(cors());
console.log(app);

// Анализ парсинга входящих HTTP-запросов в формате JSON (для дальнейшей обработки сервером)
app.use(express.json());

// Для разрешения доступа с конкретного источника (с фронта)
// app.use(cors({ origin: 'http://localhost:3001' }));


// Запуск HTTP-сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});