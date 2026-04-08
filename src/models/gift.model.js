const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    icon: String,

    coinValue: {
      type: Number,
      required: true
    },

    diamondValue: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

GiftSchema.index({ isActive: 1 });

module.exports = mongoose.model("Gift", GiftSchema);