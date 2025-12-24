const FileReader = require("../io/FileReader");
const MessageRenderer = require("../mail/MessageRenderer");
const Mailer = require("../mail/Mailer");
const Logger = require("../logging/Logger");
const RateLimiter = require("../mail/RateLimiter");
const createTransporter = require("../utils/transporter");

function createApp(config = {}) {
    const logger = new Logger(config.logFile);
    const transporter = createTransporter({
        host: config.smtpHost,
        port: config.smtpPort,
        user: config.smtpUser,
        pass: config.smtpPass,
    });

    const rateLimiter = new RateLimiter(config.rateLimitMs);

    const mailer = new Mailer({
        transporter,
        logger,
        defaults: {
            from: config.from,
            bcc: config.bcc
        }
    });

    const fileReader = new FileReader();

    return {
        mailer,
        fileReader,
        rateLimiter,
        MessageRenderer
    };
}

module.exports = createApp;