const Mailer = require("../src/Mailer");
const createEtherealTransporter = require("./helpers/etherealTransporter");

describe("Mailer logic", () => {
    test("Mailer.sendOne() should send a single email successfully", async () => {
        const { transporter } = await createEtherealTransporter();

        // Mock dependencies
        const logger = { log: jest.fn() };
        const rateLimiter = { wait: jest.fn() };

        const mailer = new Mailer({ transporter, logger, rateLimiter });

        const result = await mailer.sendOne({
            email: "test@ethereal.email",
            subject: "Hello",
            message: "This is a test message for sendOne function",
        });

        expect(result.success).toBe(true);
        expect(result.messageId).toBeDefined();
        expect(logger.log).toHaveBeenCalled();
    });

    test("Mailer.sendBulk() should handle multiple emails and respect rate limiting", async () => {
        // Fake transporter
        const transporter = {
            sendMail: jest
                .fn()
                .mockResolvedValueOnce({ messageId: "1" })
                .mockRejectedValueOnce(new Error("SMTP error"))
                .mockResolvedValueOnce({ messageId: "3" }),
        };

        const logger = { log: jest.fn() };
        const rateLimiter = { wait: jest.fn() };

        const mailer = new Mailer({ transporter, logger, rateLimiter });

        const results = await mailer.sendBulk([
            { email: "a@test.com" },
            { email: "b@test.com" },
            { email: "c@test.com" },
        ]);

        expect(results).toHaveLength(3);
        expect(results[0].success).toBe(true);
        expect(results[1].success).toBe(false);
        expect(results[2].success).toBe(true);
        expect(rateLimiter.wait).toHaveBeenCalledTimes(2);
    });
});
