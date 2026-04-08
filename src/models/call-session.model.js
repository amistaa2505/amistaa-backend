const mongoose = require("mongoose");

const CallSessionSchema = new mongoose.Schema(
  {
    callerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    callType: {
      type: String,
      enum: ["audio", "video"]
    },

    status: {
      type: String,
      enum: [
        "initiated",
        "ringing",
        "connected",
        "ended",
        "missed",
        "rejected"
      ],
      default: "initiated"
    },

    startTime: Date,

    endTime: Date,

    duration: {
      type: Number,
      default: 0
    },

    cost: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

CallSessionSchema.index({ callerId: 1 });
CallSessionSchema.index({ receiverId: 1 });
CallSessionSchema.index({ startTime: -1 });
CallSessionSchema.index({ status: 1 });

module.exports = mongoose.model("CallSession", CallSessionSchema);