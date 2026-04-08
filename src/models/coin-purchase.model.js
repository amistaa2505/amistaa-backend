const mongoose = require("mongoose");

const CoinPurchaseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        coins: {
            type: Number,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        paymentGateway: {
            type: String,
            enum: ["razorpay", "stripe", "apple", "google"]
        },

        transactionId: String,

        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

/* INDEXES */

CoinPurchaseSchema.index({ userId: 1 });
CoinPurchaseSchema.index({ status: 1 });
CoinPurchaseSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CoinPurchase", CoinPurchaseSchema);