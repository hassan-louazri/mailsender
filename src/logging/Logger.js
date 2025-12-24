const fs = require("fs");
const path = require("path");

class Logger {
    constructor(destination = "log/email-tracking.log") {
        this.logPath = path.resolve(destination);
    }

    log(level, entry = {}) {
        const line = JSON.stringify({
            timestamp: new Date().toISOString(),
            level: level,
            ...entry,
        });

        fs.appendFileSync(this.logPath, line + "\n");
    }

    info(entry) {
        this.log("INFO", entry);
    }

    error(entry) {
        this.log("ERROR", entry);
    }

    warn(entry) {
        this.log("WARN", entry);
    }
}

module.exports = Logger;
