const txtReader = require("./FileReader");

/**
 * templateLoader object to load an email template from a txt file
 * and replace placeholders with custom words per email.
 *
 * Needs a "filePath" for the template file and an array of contacts.
 *
 * Make sure the placeholders in the template have the same names
 * as the keys in the contacts object.
 */

class MessageRenderer {
    /**
     * Create templateLoader for template that has filePath as path.
     * @param {string} filePath
     */
    constructor(filePath) {
        this.filePath = filePath;
    }

    /**
     *
     * @param {Array<Object>} contacts - An array that contains information about each person to contact. (name, email, location, company, ...)
     * Example: contacts (name, email, company, location) change it based on template placeholders
     * @returns {Array<Object>} emails - An array that contains objects of (email, message) of the person to whom we will send.
     */
    renderMessages(contacts) {
        // Create reader for txt file template
        const reader = new txtReader();

        // Create messages array
        const messages = [];
        const subject = "Candidature spontanée - alternance marketing";

        // Read the template
        const template = reader.read(this.filePath);

        // Render the messages based on template
        contacts.forEach((contact) => {
            messages.push({
                email: contact.email,
                subject: subject,
                message: template.replace(
                    /{{(.*?)}}/g,
                    (_, key) => contact[key.trim()] || ""
                ),
            });
        });

        // Return the result [{email, subject, message}]
        return messages;
    }
}

module.exports = MessageRenderer;
