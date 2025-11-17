import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.js';

export const sendEmailNotification = async (order) => {
    if (!emailConfig.host || !emailConfig.user) {
        console.warn('Email credentials not set');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: false,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
        },
    });

    const mailOptions = {
        from: emailConfig.from,
        to: emailConfig.to,
        subject: `Новая заявка на аренду: ${order.car_name}`,
        html: `
            <h2>Новая заявка на аренду</h2>
            <p><strong>Автомобиль:</strong> ${order.car_name}</p>
            <p><strong>Клиент:</strong> ${order.customer_name}</p>
            <p><strong>Телефон:</strong> ${order.customer_phone}</p>
            ${order.customer_email ? `<p><strong>Email:</strong> ${order.customer_email}</p>` : ''}
            <p><strong>ID заявки:</strong> ${order.id}</p>
            <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    } catch (err) {
        console.log('Email notification error: ', err);
        throw err;
    }
}