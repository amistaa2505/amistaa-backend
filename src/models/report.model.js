const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({

    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reason: {
        type: String,
        enum: [
            "spam",
            "abuse",
            "nudity",
            "fake",
            "harassment"
        ]
    },

    details: String,

    status: {
        type: String,
        enum: ["pending", "reviewed", "resolved"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("UserReport", ReportSchema);