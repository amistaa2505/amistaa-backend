const mongoose = require("mongoose");

const UserActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    action: {
        type: String,
        enum: [
            "view_profile",
            "update_profile",
            "upload_photo",
            "update_location",
            "update_interests",
            "search_users",
            "nearby_users"
        ]
    },

    ip: String,

    device: String,

    status: {
        type: String,
        enum: ["success", "failed"],
        default: "success"
    }

}, { timestamps: true });

UserActivityLogSchema.index({ userId: 1 });
UserActivityLogSchema.index({ action: 1 });

module.exports = mongoose.model("UserActivityLog", UserActivityLogSchema);
