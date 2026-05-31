class RateLimiter {
    constructor(delay = 5000) {
        this.delay = delay;
    }

    async wait(delay) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay || this.delay);
        });
    }
}

module.exports = RateLimiter;
