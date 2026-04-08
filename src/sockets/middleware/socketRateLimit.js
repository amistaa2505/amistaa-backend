const { RateLimiterMemory } = require("rate-limiter-flexible");

const limiter = new RateLimiterMemory({
    points: 10,
    duration: 1
});

module.exports = function socketRateLimit(socket) {

    socket.onAny(async () => {

        try {

            await limiter.consume(socket.handshake.address);

        } catch {

            socket.disconnect();

        }

    });

};
