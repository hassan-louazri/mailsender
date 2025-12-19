const nodemailer = require("nodemailer");

/**
 * Creates a Nodemailer transporter using Ethereal for testing
 * Returns transporter and account info for preview URLs
 */
async function createEtherealTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    return { transporter, testAccount };
}

module.exports = createEtherealTransporter;
