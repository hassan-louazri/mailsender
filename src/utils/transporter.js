require("dotenv").config();
const nodemailer = require('nodemailer');


function createTransporter() {
    return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAIN_USER,
                pass: process.env.MAIN_PASS,
            },
        });
}

module.exports = createTransporter;