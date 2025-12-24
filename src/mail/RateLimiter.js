class RateLimiter {
    constructor(delay = 5000) {
        this.delay = delay;
    }

    async wait() {
        return new Promise((resolve) => {
            setTimeout(resolve, this.delay);
        });
    }
}

module.exports = RateLimiter;
