const fs = require("fs");
const path = require("path");

class Logger {
    constructor(destination = "log/email-tracking.log") {
        this.logPath = path.resolve(destination);
    }

    log(level, entry = {}) {
        const line = [
            this._newDateFormatted(),
            level || "INFO",
            entry.success ? "QUEUD" : "FAILED",
            entry.to || "Unkown recipient",
            entry.messageId || "Unkown message ID",
            entry.error || "No error."
        ].join(" | ");

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

    _newDateFormatted() {
        const date = new Date();
        
        const pad = (n) => n.toString().padStart(2, "0");

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
}

module.exports = Logger;
