const jwt = require("jsonwebtoken");
const AuthLog = require("../models/auth-log.model");
const { generateOtp } = require("../services/otp.service");
const authService = require("../services/auth.service");
const UserSerializer = require("../serializers/user.serializer");
const Session = require("../models/session.model");
const tokenService = require("../services/token.service");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");


exports.sendOtp = async (req, res, next) => {

    try {

        const { phone } = req.body;

        const otp = await generateOtp(phone);

        await AuthLog.create({
            phone,
            action: "send_otp",
            status: "success"
        });

        res.json({
            success: true,
            message: "OTP sent",
            otp
        });

    } catch (err) {
        next(err);
    }

};


exports.verifyOtp = async (req, res, next) => {
    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required"
            });
        }

        // get latest OTP
        const otpRecord = await Otp.findOne({ phone }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // check if already used
        if (otpRecord.verified) {
            return res.status(400).json({
                success: false,
                message: "OTP already used"
            });
        }

        // check expiry
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        // check OTP match
        if (otpRecord.otp !== String(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // mark verified
        await Otp.deleteMany({ phone });

        const { user, isNewUser } = await authService.verifyOtpService(phone);

        const deviceId = uuidv4();

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        await Session.create({
            userId: user._id,
            deviceId,
            refreshToken,
            deviceName: req.headers["device-name"],
            deviceOS: req.headers["device-os"],
            ipAddress: req.ip
        });

        res.json({
            success: true,
            message: "OTP verified successfully",
            newUser: isNewUser,
            accessToken,
            refreshToken,
            user: UserSerializer.serialize(user)
        });

    } catch (err) {
        next(err);
    }
};


exports.logout = async (req, res) => {

    const { userId, deviceId } = req.body;

    await Session.updateOne(
        { deviceId },
        { isActive: false }
    );

    // IF WANT TO LOGOUT FROM MULTIPLE DEVICES
    // await Session.updateMany(
    //     { userId },
    //     { isActive: false }
    // );

    await AuthLog.create({
        userId,
        action: "logout",
        status: "success"
    });

    res.json({
        success: true,
        message: "Logged Out"
    });

};


exports.deleted = async (req, res) => {

    const { userId } = req.body;

    await User.updateOne(
        { _id: userId },
        { status: "deleted" }
    );

    await AuthLog.create({
        userId,
        action: "delete_account",
        status: "success"
    });

    res.json({
        success: true,
        message: "Account Deleted"
    });

};


exports.refreshToken = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const session = await Session.findOne({
            userId: decoded.userId,
            refreshToken,
            isActive: true
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid session"
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate NEW tokens
        const newAccessToken = tokenService.generateAccessToken(user);
        const newRefreshToken = tokenService.generateRefreshToken(user);

        // Rotate refresh token in session
        session.refreshToken = newRefreshToken;
        await session.save();

        res.json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (err) {
        return res.status(401).json({
            message: "Invalid refresh token"
        });
    }

};


exports.devices = async (req, res) => {

    const sessions = await Session.find({
        userId: req.user.userId,
        isActive: true
    });

    res.json(sessions);

};
