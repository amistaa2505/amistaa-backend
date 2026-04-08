const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    deviceId: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String,
        required: true
    },

    deviceName: String,
    deviceOS: String,
    ipAddress: String,

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
