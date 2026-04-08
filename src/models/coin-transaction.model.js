const mongoose = require("mongoose");

const CoinTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: [
        "purchase",
        "call_charge",
        "gift_sent",
        "gift_received",
        "withdraw",
        "bonus",
        "refund"
      ],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    balanceAfter: {
      type: Number
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },

    description: String
  },
  { timestamps: true }
);

CoinTransactionSchema.index({ userId: 1 });
CoinTransactionSchema.index({ createdAt: -1 });
CoinTransactionSchema.index({ type: 1 });

module.exports = mongoose.model("CoinTransaction", CoinTransactionSchema);
