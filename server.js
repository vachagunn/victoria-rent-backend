import dotenv from 'dotenv';
import express from 'express';

// Загружает переменные из файла .env в process.env (переменные окружения).
// Хранение конфиденциальных данных (API ключи) вне кодовой базы и использование их в приложении.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Запуск HTTP-сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});