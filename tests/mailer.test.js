const Mailer = require("../src/mail/Mailer");
const createEtherealTransporter = require("./helpers/etherealTransporter");

describe("Mailer", () => {
    let transporter;
    let logger;
    let defaults;
    let mailer;

    beforeEach(async () => {
        const ethereal = await createEtherealTransporter() 
        transporter = ethereal["transporter"];
        logger = { log: jest.fn(), info: jest.fn(), error: jest.fn() };

        defaults = {
            from: "Tester <test@ethereal.email>",
        };
        
        mailer = new Mailer({ transporter, logger, defaults });

    });

    test("sendOne - success", async () => {

        const result = await mailer.sendOne({
            email: "test-receiver@ethereal.email",
            subject: "Hello test",
            message:
                "This is a test message for sendOne function automated test.",
        });

        expect(result.success).toBe(true);
        expect(result.messageId).toBeDefined();
        expect(logger.info).toHaveBeenCalled();
    });

    test("sendOne - handles failure gracefully", async () => {
        // Temporarily inject a failing transporter
        const failingMailer = new Mailer({
            transporter: {
                sendMail: () => Promise.reject(new Error("Failure")),
            },
            logger,
            defaults: { from: "fail@test.com" },
        });

        const result = await failingMailer.sendOne({
            email: "fail@test.com",
            subject: "Fail",
            message: "Body",
        });

        expect(result.success).toBe(false);
        expect(result.error).toBe("Failure");
    });
});
