const mongoose = require("mongoose");

const GiftTransactionSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        giftId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gift"
        },

        coinsUsed: {
            type: Number
        },

        diamondsEarned: {
            type: Number
        }
    },
    { timestamps: true }
);

/* INDEXES */

GiftTransactionSchema.index({ senderId: 1 });
GiftTransactionSchema.index({ receiverId: 1 });
GiftTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("GiftTransaction", GiftTransactionSchema);