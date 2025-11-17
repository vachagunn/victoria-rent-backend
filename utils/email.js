import nodemailer from 'nodemailer';

/**
 * Функция асинхронной отправки уведомления на электронную почту при оформлении заявки на аренду автомобиля
 * @param {Object} order - Объект с информацией о заявке
 * @returns {void} генерация уведомления об успехе/неудаче отправки
 */
export const sendEmailNotification = async (order) => {

    /**
     * Основной транспорт для отправки электронных писем, конфигурация переменных окружения
     * @type {Object} Объект трансопрта Nodemailer
     */
    const transporter = nodemailer.createTransport({
        service: process.env.GMAIL_SERVICE,
        host: process.env.GMAIL_HOST,
        port: Number(process.env.GMAIL_PORT),
        secure: Boolean(process.env.GMAIL_SECURE),
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    // Проверка обязательеых полей при заполнении заявки
    if (!transporter || !order?.car_name || !order?.customer_name || !order?.customer_phone || !order?.customer_email) {
        console.warn('Email credentials not set');
        return;
    }

    // Шаблон письма для администратора
    const mailOptionsForAdmin = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `Новая заявка на аренду: ${order.car_name}`,
        html: `
            <h2>Новая заявка на аренду</h2>
            <p><strong>Автомобиль:</strong> ${order.car_name}</p>
            <p><strong>Клиент:</strong> ${order.customer_name}</p>
            <p><strong>Телефон:</strong> ${order.customer_phone}</p>
            ${order.customer_email ? `<p><strong>Email:</strong> ${order.customer_email}</p>` : ''}
            <p><strong>ID заявки:</strong> ${order.id ?? 'N/A'}</p>
            <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        `,
    };

    // Шаблон письма для клиента
    const mailOptionsForClient = {
        from: process.env.GMAIL_USER,
        to: order.customer_email,
        subject: `Заявка на аренду: ${order.car_name}`,
        html: `
            <h2>Спасибо за вашу заявку!</h2>
            <p>Мы получили вашу заявку на аренду автомобиля ${order.car_name}.</p>
            <p>Наш менеджер свяжется с вами в ближайшее время.</p>
        `,
    };

    // Отправка двух писем одновременно
    try {
        await Promise.all([
            transporter.sendMail(mailOptionsForAdmin),
            transporter.sendMail(mailOptionsForClient)
        ]);
        console.log('Email notification sent successfully');
    } catch (err) {
        console.log('Email notification error: ', err);
        throw err;
    }
};