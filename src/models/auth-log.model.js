const mongoose = require("mongoose");


const AuthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    phone: String,

    action: {
        type: String,
        enum: [
            "send_otp",
            "verify_otp",
            "firebase_login",
            "login",
            "register",
            "logout",
            "delete_account"
        ]
    },

    ip: String,

    device: String,

    status: {
        type: String,
        enum: [
            "success",
            "failed"
        ]
    }
}, { timestamps: true });


AuthLogSchema.index({ userId: 1 });
AuthLogSchema.index({ action: 1 });


module.exports = mongoose.model("AuthLog", AuthLogSchema);
