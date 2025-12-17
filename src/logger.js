const fs = require("fs");
const path = require("path");

class logger {
    constructor(destination = "email.log") {
        this.logPath = path.resolve(destination);
    }

    log(entry = {}) {
        const line = [
            new Date().toISOString(),
            entry.success ? "SUCCESS" : "FAIL",
            entry.to || "unkown recipient",
            entry.messageId || "unkown message id",
            entry.error || "no error",
        ].join(" | ");

        fs.appendFileSync(this.logPath, line + "\n");
    }
}

module.exports = logger;
