const User = require("../models/user.model");

exports.updateProfile = async (userId, data) => {

    const allowedFields = [
        "username",
        "email",
        "gender",
        "bio",
        "avatar"
    ];

    let updateData = {};

    for (let key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new Error("User not found");
    }

    return user;

};