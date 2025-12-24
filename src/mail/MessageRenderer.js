const txtReader = require("../io/FileReader");

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
     * @param {string} template
     */
    constructor(template) {
        if (!template)
            throw new Error("MessageRenderer: template string is required.");
        this.template = template;
    }

    /**
     *
     * @param {Array<Object>} contacts - An array that contains information about each person to contact. (name, email, location, company, ...)
     * Example: contacts (name, email, company, location) change it based on template placeholders
     * @returns {Array<Object>} emails - An array that contains objects of (email, message) of the person to whom we will send.
     */
    render(subject, contacts = []) {
        return contacts.map((contact) => ({
            email: contact.email,
            subject: subject,
            message: this.template.replace(
                /{{(.*?)}}/g,
                (_, key) => contact[key.trim()] ?? ""
            ),
        }));
    }
}

module.exports = MessageRenderer;
