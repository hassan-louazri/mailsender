const csvReader = require("./csvReader");
const templateLoader = require("./templateLoader");
const mailer = require("./mailer");
// Create a reader instance
const reader = new csvReader({
    delimiter: ",", // Optional: default is comma
    hasHeaders: true, // Optional: default is true
    encoding: "utf8", // Optional: default is utf8
});

const loader = new templateLoader("data/template.txt");
const mailSender = new mailer();

try {
    // Read and parse CSV to JSON
    const contacts = reader.read("data/target-list.csv");
    // render email for each contact
    const emails = loader.renderTemplate(contacts);

    (async () => {
        const result = await mailSender.sendBulk(emails);
        console.log("Final result: ", result);
    })();
} catch (error) {
    console.error("Error:", error.message);
}
