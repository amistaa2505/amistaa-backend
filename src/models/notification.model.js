const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    title: String,

    message: String,

    type: {
      type: String,
      enum: [
        "system",
        "call",
        "gift",
        "wallet",
        "promotion"
      ]
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);