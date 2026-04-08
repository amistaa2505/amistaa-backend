const mongoose = require("mongoose");

const BlockLogSchema = new mongoose.Schema({

    action: {
        type: String,
        enum: [
            "BLOCK",
            "UNBLOCK",
            "AUTO_BLOCK",
            "TEMP_BLOCK",
            "SHADOW_BLOCK",
            "GLOBAL_BLOCK",
            "EXPIRE",
            "REPORT_TRIGGER",
            "GET_LIST"
        ],
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: ["manual", "auto", "shadow", "temporary", "global"]
    },

    reason: String,

    metadata: {
        reportCount: Number,
        expiresAt: Date
    },

    ip: String,
    userAgent: String

}, { timestamps: true });

module.exports = mongoose.model("BlockLog", BlockLogSchema);