const mongoose = require("mongoose");

const CallQueueSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        genderPreference: {
            type: String,
            enum: ["male", "female", "any"],
            default: "any"
        },

        callType: {
            type: String,
            enum: ["audio", "video"],
            default: "video"
        },

        status: {
            type: String,
            enum: ["waiting", "matched", "cancelled"],
            default: "waiting"
        }
    },
    { timestamps: true }
);

/* INDEXES */

CallQueueSchema.index({ status: 1 });
CallQueueSchema.index({ userId: 1 });

module.exports = mongoose.model("CallQueue", CallQueueSchema);