const jwt = require("jsonwebtoken");
const AuthLog = require("../models/auth-log.model");
const {generateOtp} = require("../services/otp.service");
const authService = require("../services/auth.service");
const UserSerializer = require("../serializers/user.serializer");
const Session = require("../models/session.model");
const tokenService = require("../services/token.service");
const {v4: uuidv4} = require("uuid");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");


exports.sendOtp = async (req, res, next) => {

    try {

        const {phone} = req.body;

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

        const {phone, otp} = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required"
            });
        }

        // get latest OTP
        const otpRecord = await Otp.findOne({phone}).sort({createdAt: -1});

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
        await Otp.deleteMany({phone});

        const {user, isNewUser} = await authService.verifyOtpService(phone);

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


exports.firebaseLogin = async (req, res, _) => {
    try {
        const admin = require("../config/firebase");
        const {token} = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Firebase token required",
            });
        }

        console.log("📲 Firebase login attempt");

        // 🔥 Verify Firebase ID Token
        const decoded = await admin.auth().verifyIdToken(token);

        const phone = decoded.phone_number;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number not found",
            });
        }

        // if (!decoded.phone_number_verified) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Phone not verified",
        //     });
        // }

        console.log("✅ Firebase verified:", phone);

        // ✅ Check or create user
        let user = await User.findOne({phone});
        let isNewUser = false;

        if (!user) {
            const randomSuffix = Math.floor(1000 + Math.random() * 9000); // e.g., 4 digits
            const username = `user${randomSuffix}`;

            user = await User.create({
                phone,
                username,
            });

            isNewUser = true;
            console.log("🆕 New user created:", phone);
        } else {
            console.log("👤 Existing user login:", phone);
        }

        // 🔐 Generate tokens
        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        const deviceId = req.headers["device-id"] || uuidv4();

        // 🛑 Deactivate old session for same device (anti-spam)
        await Session.updateMany(
            {userId: user._id, deviceId},
            {isActive: false}
        );

        // 💾 Create new session
        await Session.create({
            userId: user._id,
            deviceId,
            refreshToken,
            deviceName: req.headers["device-name"] || "unknown",
            deviceOS: req.headers["device-os"] || "unknown",
            ipAddress: req.ip,
        });

        // 🧾 Success log
        await AuthLog.create({
            userId: user._id,
            phone,
            action: "firebase_login",
            status: "success",
            ipAddress: req.ip,
        });

        console.log("🔐 Session created:", deviceId);

        res.json({
            success: true,
            message: "Login successful",
            newUser: isNewUser,
            accessToken,
            refreshToken,
            user: UserSerializer.serialize(user), // must include role
        });

    } catch (err) {

        console.error("❌ Firebase login error:", err.message);

        // 🧾 Failed log
        await AuthLog.create({
            action: "firebase_login",
            status: "failed",
            ipAddress: req.ip,
        });

        return res.status(401).json({
            success: false,
            message: "Invalid Firebase token",
        });

    }
};

exports.logout = async (req, res) => {

    const userId = req.user.id;
    const { deviceId } = req.body;

    await Session.updateOne(
        { userId, deviceId },
        { isActive: false }
    );

    // IF YOU WANT TO LOG OUT FROM MULTIPLE DEVICES
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

    const {userId} = req.body;

    await User.updateOne(
        {_id: userId},
        {status: "deleted"}
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

        const {refreshToken} = req.body;

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
