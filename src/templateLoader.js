const csvReader = require("./csvReader");

class templateLoader {
    constructor(filePath, contacts = []) {
        this.filePath = filePath;
        this.contacts = contacts;
    }

    renderTemplate(contacts) {
        const reader = new csvReader();
        const emails = [];
        const template = reader.read(this.filePath);
        contacts.forEach((contact) => {
            emails.push({
                email: contact.email,
                message: template.replace(
                    /{{(.*?)}}/g,
                    (_, key) => contact[key.trim()] || ""
                ),
            });
        });
        return emails;
    }
}

module.exports = templateLoader;
