const fileReader = require("./FileReader");
const MessageRenderer = require("./MessageRenderer");
const Mailer = require("./Mailer");
const Logger = require("./Logger");
const RateLimiter = require("./RateLimiter");

const createTransporter = require("./utils/transporter");

const templatePath = "data/template.txt";
const targetListPath = "data/target-list.csv";
const attachedFile = [
    {
        filename: "cv-hassan-marketing.pdf",
        path: "data/cv-traffic-management.pdf",
    },
];

// Create a reader instance
const reader = new fileReader();

// Create a messageRenderer
const renderer = new MessageRenderer(templatePath);

// Create a mailer based on nodemailer
const mailer = new Mailer({
    transporter: createTransporter(),
    logger: new Logger(),
    rateLimiter: new RateLimiter(),
});

try {
    // Read and parse CSV to JSON array of objects {name, email, company, location}
    const contacts = reader.read(targetListPath);

    // render custom message for each contact. messages is an array of objects {email, subject, message}
    const messages = renderer.renderMessages(contacts);

    // Send one email for each contact
    (async () => {
        const result = await mailer.sendBulk(messages, attachedFile);
        console.log("============= RECAP =============");
        console.log(result);
        console.log("=================================");
    })();
} catch (error) {
    console.error("Error while sending emails:", error);
}
