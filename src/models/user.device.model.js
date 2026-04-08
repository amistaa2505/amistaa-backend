const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  deviceId: String,

  deviceType: String,

  pushToken: String,

  lastActive: Date

},
{ timestamps: true });

module.exports = mongoose.model("UserDevice", DeviceSchema);
