const fs = require("fs");
const path = require("path");

/**
 * CSV reader to read csv files and parse them into json objects
 */
class csvReader {
    /**
     * Create CSV reader with basic configuration
     * @param {Object} options - Basic options only: delimiter, hasHeaders and encoding
     */
    constructor(options = {}) {
        this.config = {
            delimiter: options.delimiter || ",",
            hasHeaders: options.hasHeaders !== false, // true by default
            encoding: options.encoding || "utf8",
            ...options,
        };
    }

    /**
     * Read CSV file and parse to JSON (synchronous)
     * @param {string} filePath - Path to CSV file
     * @returns {Array<Object>} Array of objects (JSON)
     * @throws {Error} If file not found or cannot be read
     */
    read(filePath) {
        // 1. Validate and read file
        const absolutePath = this._resolvePath(filePath);
        this._validateFile(absolutePath);

        const content = fs.readFileSync(absolutePath, this.config.encoding);

        // return plain text if file is '.txt'
        if ("txt" === path.extname(absolutePath).slice(1)) {
            return content;
        }
        // 2. Parse content to JSON
        const contacts = this._parseToJSON(content);

        // 3. Return filtered contacts by email
        return contacts
            .filter((contact) => contact.email != "")
            .map((contact) => ({
                name: contact.contact.split(" ")[0],
                company: contact.entreprise,
                location: contact.location,
                email: contact.email,
            }));
    }

    /**
     * Parse CSV content string to JSON array
     * @private
     */
    _parseToJSON(content) {
        const lines = this._splitLines(content);

        if (lines.length === 0) {
            return [];
        }

        // Extract headers or generate them
        let headers;
        let dataLines;

        if (this.config.hasHeaders) {
            headers = this._parseLine(lines[0]);
            dataLines = lines.slice(1);
        } else {
            // If no headers, use first row to determine column count
            const firstRow = this._parseLine(lines[0]);
            headers = firstRow.map((_, i) => `col${i + 1}`);
            dataLines = lines;
        }

        // Convert each data line to object
        return dataLines.map((line) => {
            const values = this._parseLine(line);
            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index] || "";
            });

            return row;
        });
    }

    /**
     * Split content into lines, removing empty ones
     * @private
     */
    _splitLines(content) {
        return content.split(/\r?\n/).filter((line) => line.trim() !== "");
    }

    /**
     * Parse a single CSV line using delimiter
     * @private
     */
    _parseLine(line) {
        return line.split(this.config.delimiter).map((cell) => cell.trim());
    }

    /**
     * Resolve file path (relative → absolute)
     * @private
     */
    _resolvePath(filePath) {
        return path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath);
    }

    /**
     * Validate file exists and is readable
     * @private
     */
    _validateFile(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        // Quick check if it's a file (not directory)
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            throw new Error(`Path is not a file: ${filePath}`);
        }
    }
}

// Export the class
module.exports = csvReader;
