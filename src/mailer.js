const nodemailer = require("nodemailer");
require("dotenv").config();
const logger = require("./logger");

class mailer {
    constructor(rateLimit = 5000) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.OUTLOOK_USER,
                pass: process.env.OUTLOOK_PASS,
            },
        });

        this.rateLimit = rateLimit;
        this.logger = new logger("log/email-tracking.log");
    }

    async sendOne(data = {}) {
        try {
            const info = await this.transporter.sendMail({
                from: `Hassan Louazri <${process.env.OUTLOOK_USER}`,
                to: data.email,
                bcc: process.env.BCC,
                subject: data.subject || "Candidature spontanée",
                text: data.message,
                attachments: [
                    {
                        filename: "cv-hassan-seo.pdf",
                        path: "data/cv-marketing-seo.pdf",
                    },
                ],
            });

            const result = {
                success: true,
                messageId: info.messageId,
                to: data.email,
            };

            this.logger.log(result);

            return result;
        } catch (error) {
            const result = {
                success: false,
                to: data.email,
                error: error.message,
            };

            this.logger.log(result);

            return result;
        }
    }

    async sendBulk(data = []) {
        const results = [];

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            console.log(
                `Sending email ${i + 1}/${data.length} -> ${data[i].email} ...`
            );

            const result = await this.sendOne(item);
            results.push(result);

            if (i < data.length - 1) {
                await new Promise((res) => {
                    console.log(
                        `Waiting for ${this.rateLimit} before sending next email.`
                    );
                    setTimeout(res, this.rateLimit);
                });
            }
        }

        return results;
    }
}

module.exports = mailer;
