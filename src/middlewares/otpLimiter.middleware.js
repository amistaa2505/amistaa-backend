const rateLimit = require("express-rate-limit");

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,        // 5 minutes
    max: 5,                     // only 5 otp requests
    message: {
        success: false,
        message: "Too many requests. Try again later."
    }
});


module.exports = otpLimiter;
