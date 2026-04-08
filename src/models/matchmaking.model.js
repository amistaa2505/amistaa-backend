const mongoose = require("mongoose");

const MatchmakingSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        callType: {
            type: String,
            enum: ["audio", "video"]
        },

        status: {
            type: String,
            enum: ["matched", "connected", "ended"],
            default: "matched"
        }
    },
    { timestamps: true }
);

/* INDEXES */

MatchmakingSchema.index({ user1: 1 });
MatchmakingSchema.index({ user2: 1 });
MatchmakingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Matchmaking", MatchmakingSchema);