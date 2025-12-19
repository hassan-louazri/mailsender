const nodemailer = require("nodemailer");
const createEtherealTransporter = require("./helpers/etherealTransporter");

describe("SMTP Transporter (Ethereal)", () => {
    test("should send an email successfully", async () => {
        const { transporter } = await createEtherealTransporter();

        const info = await transporter.sendMail({
            from: "Tester <tester@example.com>",
            to: "receiver@example.com",
            subject: "Test email",
            text: "Hello from Ethereal!",
        });

        expect(info.messageId).toBeDefined();

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log("Preview URL:", previewUrl);
    });
});
