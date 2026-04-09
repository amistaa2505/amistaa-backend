const User = require("../models/user.model");
const UserSerializer = require("../serializers/user.serializer");
const profileService = require("../services/profile.service");
const UserActivityLog = require("../models/user-activity-log.model");


exports.register = async (req, res) => {

    res.json({
        success: true,
        message: "Register API working"
    });

};

exports.getMe = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.userId);

        await UserActivityLog.create({
            userId: req.user.userId,
            action: "view_profile",
            ip: req.ip,
            device: req.headers["device-name"]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            data: UserSerializer.serialize(user)
        });

    } catch (err) {
        next(err);
    }

};

exports.updateMe = async (req, res, next) => {

    try {

        const userId = req.user.userId;

        const user = await profileService.updateProfile(
            userId,
            req.body
        );

        await UserActivityLog.create({
            userId: req.user.userId,
            action: "update_profile",
            ip: req.ip,
            device: req.headers["device-name"]
        });

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: UserSerializer.serialize(user)
        });

    } catch (err) {
        next(err);
    }

};

exports.updateRole = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const {role} = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {role: role},
            {
                new: true,
                runValidators: true,
            }
        );

        await UserActivityLog.create({
            userId: req.user.userId,
            action: "role_update",
            ip: req.ip,
            device: req.headers["device-name"]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            data: UserSerializer.serialize(user)
        });

    } catch (e) {
        next(err);
    }
};

exports.uploadPhoto = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {avatar: req.file.filename},
            {new: true}
        );

        res.json({
            success: true,
            message: "Photo uploaded",
            data: UserSerializer.serialize(user)
        });

    } catch (err) {
        next(err);
    }
};


exports.updateLocation = async (req, res, next) => {

    try {

        const {lat, lng, city, country} = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                city,
                country
            },
            {new: true}
        );

        res.json({
            success: true,
            message: "Location updated",
            data: {
                id: user.id,
                username: user.username,
                status: user.status,
                avatar: user.avatar,
                location: user.location
            }
        });

    } catch (err) {
        next(err);
    }

};


exports.updateInterests = async (req, res, next) => {

    try {

        const {interests} = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {interests},
            {new: true}
        );

        await UserActivityLog.create({
            userId: req.user.userId,
            action: "update_interests"
        });

        res.json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                status: user.status,
                avatar: user.avatar,
                interests: user.interests
            }
        });

    } catch (err) {
        next(err);
    }

};


exports.searchUsers = async (req, res, next) => {

    try {

        const {keyword} = req.query;

        const users = await User.find({
            username: {$regex: keyword, $options: "i"}
        }).limit(20);

        await UserActivityLog.create({
            userId: req.user.userId,
            action: "search_users"
        });

        res.json({
            success: true,
            data: UserSerializer.serializeMany(users)
        });

    } catch (err) {
        next(err);
    }

};


exports.nearbyUsers = async (req, res, next) => {

    try {

        const {lat, lng} = req.query;

        const users = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 5000 // meters
                }
            },
            status: "active"
        }).limit(20);

        res.json({
            success: true,
            data: UserSerializer.serializeMany(users)
        });

    } catch (err) {
        next(err);
    }

};
