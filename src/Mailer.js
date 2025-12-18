require("dotenv").config();

/**
 * Mailer
 * ------
 * Core service responsible for sending emails (single or bulk).
 *
 * Responsibilities:
 * - Orchestrates email sending using an injected transporter (SMTP client)
 * - Applies rate limiting between bulk sends
 * - Logs all send attempts and results
 *
 * This class does NOT:
 * - Create its own transporter (injected for flexibility & testability)
 * - Handle persistence or queue logic
 */

class Mailer {
    /**
     * @constructor
     *
     * @param {Object} options
     * @param {Object} options.transporter - Nodemailer transporter (DI)
     * @param {number} [options.rateLimit=5000] - Delay in ms between emails
     * @param {string} [options.logFile] - Path to log file
     *
     * Dependency Injection:
     * - transporter is injected to allow:
     *   - multiple SMTP providers
     *   - easier unit testing (mock transporter)
     *   - better separation of concerns
     */
    constructor({ transporter, logger, rateLimiter }) {
        if (!transporter)
            throw new Error("Mailer requires a transporter instance.");
        if (!logger) throw new Error("logger required.");
        if (!rateLimiter) throw new Error("rateLimiter required");

        this.transporter = transporter;
        this.logger = logger;
        this.rateLimiter = rateLimiter;
    }

    /**
     * Send a single email
     *
     * @param {Object} message
     * @param {string} message.email - Recipient email address
     * @param {string} message.subject - Email subject
     * @param {string} message.message - Plain text email body
     *
     * @returns {Promise<Object>} Result object containing success or error info
     */
    async sendOne(message = {}, attachments = []) {
        try {
            /**
             * Nodemailer sendMail call
             * -----------------------
             * This is the only place where the SMTP client is used directly.
             */
            const info = await this.transporter.sendMail({
                from: `Hassan Louazri <${process.env.MAIN_USER}`,
                to: message.email,
                subject: message.subject,
                text: message.message,
                attachments: attachments,
            });

            // Successful send result
            const result = {
                success: true,
                messageId: info.messageId,
                to: message.email,
            };

            // Persist result in logs
            this.logger.log(result);

            return result;
        } catch (error) {
            /**
             * Failed send result
             * We catch errors here to prevent bulk sending from crashing
             */
            const result = {
                success: false,
                to: message.email,
                error: error.message,
            };

            // Persist error details
            this.logger.log(result);

            return result;
        }
    }

    /**
     * Send multiple emails sequentially with rate limiting
     *
     * @param {Array<Object>} messages
     * @param {Array<Object>} attachments
     * @param {string} attachments[i].filename
     * @param {string} attachments[i].path
     * @returns {Promise<Array<Object>>} Array of send results
     *
     * Design notes:
     * - Emails are sent sequentially (not in parallel)
     * - Rate limiter enforces delay between sends
     * - Failures do not stop the loop
     */
    async sendBulk(messages = [], attachments = []) {
        const results = [];

        for (let i = 0; i < messages.length; i++) {
            const messageItem = messages[i];
            console.log(
                `Sending email ${i + 1}/${messages.length} -> ${
                    messageItem.email
                } ...`
            );
            // Send individual email per loop iteration
            const result = await this.sendOne(messageItem, attachments);

            // Aggregate results
            results.push(result);

            /**
             * Apply rate limit only if there are more emails to send
             */
            if (i < messages.length - 1) {
                await this.rateLimiter.wait();
            }
        }

        return results;
    }
}

module.exports = Mailer;
