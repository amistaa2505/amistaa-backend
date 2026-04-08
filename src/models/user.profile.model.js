const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
    userId: {},
    name: String,
    bio: String,
    age: Number,
    city: String,
    country: String,
    avatar: String,
    photos: [String],
    interests: [String],
    language: [String]
}, {timeseries: true});


module.exports = mongoose.model("UserProfile", UserProfileSchema)
