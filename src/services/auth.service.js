const User = require("../models/user.model");
const AuthLog = require("../models/auth-log.model");

exports.verifyOtpService = async (phone) => {

    let user = await User.findOne({ phone });

    let isNewUser = false;

    if (!user) {

        user = await User.create({
            phone,
            username: "user_" + Date.now()
        });

        isNewUser = true;

        await AuthLog.create({
            userId: user._id,
            phone,
            action: "register",
            status: "success"
        });

    } else {

        await AuthLog.create({
            userId: user._id,
            phone,
            action: "login",
            status: "success"
        });

    }

    return { user, isNewUser };
};