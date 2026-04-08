const mongoose = require("mongoose");


const OtpSchema = new mongoose.Schema({
    phone: String,
    email: String,

    otp: String,

    purposes: {
        type: String,
        enum: ["login", "register", "delete", "verify"],
        default: "login"
    },

    expiresAt: Date,

    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


OtpSchema.index({ phone: 1 });
OtpSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("Otp", OtpSchema);
