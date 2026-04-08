const mongoose = require("mongoose");


const LoginLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ip: String,
    device: String,
    location: String,
    loginAt: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model("UserLoginLog", LoginLogSchema);
