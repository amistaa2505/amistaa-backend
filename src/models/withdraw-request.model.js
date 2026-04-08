const mongoose = require("mongoose");

const WithdrawRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    diamonds: {
      type: Number,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "bank"]
    },

    paymentDetails: {
      upiId: String,
      bankAccount: String,
      ifsc: String
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

WithdrawRequestSchema.index({ userId: 1 });
WithdrawRequestSchema.index({ status: 1 });
WithdrawRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("WithdrawRequest", WithdrawRequestSchema);