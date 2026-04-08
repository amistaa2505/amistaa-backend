const mongoose = require("mongoose");

const UserOnlineStatusSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        lastSeen: Date,

        socketId: String
    },
    { timestamps: true }
);

/* INDEX */

UserOnlineStatusSchema.index({ userId: 1 });
UserOnlineStatusSchema.index({ isOnline: 1 });

module.exports = mongoose.model("UserOnlineStatus", UserOnlineStatusSchema);