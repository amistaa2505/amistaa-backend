const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  reason: String,

  type: {
    type: String,
    enum: ["manual", "auto", "shadow", "temporary", "global"],
    default: "manual"
  },

  expiresAt: Date,

  isActive: {
    type: Boolean,
    default: true
  }

},
  { timestamps: true });

module.exports = mongoose.model("UserBlock", BlockSchema);