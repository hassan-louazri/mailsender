/**
 * Mailer
 * ------
 * Core service responsible for sending emails (single).
 *
 * Responsibilities:
 * - Sends one email (sendOne)
 * - Applies rate limiting between bulk sends
 * - Logs all send attempts and results
 *
 * This class does NOT:
 * - Create its own transporter (injected for flexibility & testability)
 * - Handle persistence or queue logic
 */

class Mailer {
    /**
     * @param {Object} deps
     * @param {Object} deps.transporter - Nodemailer transporter (DI)
     * @param {Object} deps.logger - Logger instance
     * @param {Object} deps.rateLimiter - RateLimiter instance
     * @param {Object} deps.defaults
     * @param {string} deps.defaults.from - Default "from" address
     * @param {string} [deps.defaults.bcc] - Optional BCC
     */
    constructor({ transporter, logger, rateLimiter, defaults = {} }) {
        if (!transporter)
            throw new Error("Mailer: transporter instance is required.");
        if (!logger) throw new Error("Mailer: Logger is required.");
        if (!rateLimiter) throw new Error("Mailer: RateLimiter is required");
        if (!defaults.from)
            throw new Error("Mailer: defaults.from is required.");

        this.transporter = transporter;
        this.logger = logger;
        this.rateLimiter = rateLimiter;
        this.defaults = defaults;
    }

    /**
     * Send a single email
     *
     * @param {Object} message
     * @param {string} message.email - Recipient email address
     * @param {string} message.subject - Email subject
     * @param {string} message.message - Plain text email body
     * @param {Array<Object>} attachments
     *
     * @returns {Promise<Object>} Result object containing success or error info
     */
    async sendOne(message = {}, attachments = []) {
        if (!message?.email || !message?.subject || !message?.message) {
            throw new Error(
                "Mailer.sendOne: message must include email, subject, and message"
            );
        }

        const payload = {
            from: this.defaults.from,
            to: message.email,
            subject: message.subject,
            text: message.message,
            attachments,
        };

        if (this.defaults.bcc) {
            payload.bcc = this.defaults.bcc;
        }

        try {
            /**
             * Nodemailer sendMail call
             * -----------------------
             * This is the only place where the SMTP client is used directly.
             */
            const info = await this.transporter.sendMail(payload);

            // Successful send result
            const result = {
                success: true,
                to: message.email,
                messageId: info.messageId,
                error: null,
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
                messageId: null,
                error: error.message,
            };

            // Persist error details
            this.logger.log(result);

            return result;
        }
    }
}

module.exports = Mailer;
