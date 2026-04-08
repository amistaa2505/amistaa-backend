const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        unique: true,
        sparse: true
    },

    phone: {
        type: String,
        unique: true,
        sparse: true
    },

    password: {
        type: String
    },

    role: {
        type: String,
        enum: ["user", "creator", "staff", "admin", "superadmin"],
        default: "user"
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    status: {
        type: String,
        enum: ["active", "blocked", "deleted"],
        default: "active"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    avatar: String,

    bio: String,

    interests: [String],

    city: String,

    country: String,

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
            default: [0, 0]
        }
    },

    lastLoginAt: Date

}, { timestamps: true });

UserSchema.index({ username: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
