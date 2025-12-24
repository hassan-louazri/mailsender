require("dotenv").config();
const nodemailer = require('nodemailer');


function createTransporter({host, port, user, pass}) {
    return nodemailer.createTransport({
            host: host,
            port: port,
            secure: false,
            auth: {
                user: user,
                pass: pass,
            },
        });
}

module.exports = createTransporter;