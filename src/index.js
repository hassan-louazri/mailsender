require("dotenv").config();

const createApp = require("./app/createApp");
const runSendBulkJob = require("./jobs/sendBulk.job");

const templatePath = "data/template.txt";
const targetListPath = "data/test-list.csv";
const subject = "Subject line";
const logFilePath = "log/email-tracking.log";
const from = `Hassan Louazri <${process.env.MAIN_USER}>`
const attachedFile = [
    {
        filename: "cv-hassan-marketing.pdf",
        path: "data/cv-marketing-seo.pdf",
    },
];

(async () => {
    try {
        const app = createApp({
            smtpHost: process.env.SMTP_HOST,
            smtpPort: process.env.SMTP_PORT,
            smtpUser: process.env.MAIN_USER,
            smtpPass: process.env.MAIN_PASS,
            rateLimitMs: 5000,
            templatePath: templatePath,
            logFile: logFilePath,
            from: from
        });

        const attachments = attachedFile;

        const results = await runSendBulkJob({
            app,
            targetListPath: targetListPath,
            templatePath: templatePath,
            subject: subject,
            attachments,
        });

        console.log("============= RECAP =============");
        console.table(results);
        console.log("=================================");
    } catch (error) {
        console.error("Fatal error: ", error);
        process.exit(1);
    }
})();
