const mongoose = require("mongoose");


const WalletSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    coins: {
        type: Number,
        default: 0,
    },
    diamonds: {
        type: Number,
        default: 0,
    },
    totalEarned: {
        type: Number,
        default: 0,
    }

}, { timestamps: true });


module.exports = mongoose.model("UserWallet", WalletSchema);
