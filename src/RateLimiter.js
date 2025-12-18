class RateLimiter {
    constructor(delay = 5000) {
        this.delay = delay;
    }

    async wait() {
        console.log(`Waiting for a period of ${this.delay} ms before next operation.`);
        return new Promise((resolve) => {
            setTimeout(resolve, this.delay);
        });
    }
}

module.exports = RateLimiter;
