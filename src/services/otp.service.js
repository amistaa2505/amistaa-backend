const Otp = require("../models/otp.model");


exports.generateOtp = async (phone) => {

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({
        phone: phone,
        otp: otp,
        expiresAt: new Date(Date.now() + 5 * 50 * 1000)
    });

    return otp;

}
