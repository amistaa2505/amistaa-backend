const UserBlock = require("../models/block.model");
const BlockLog = require("../models/block-log.model");


// BLOCK USER
exports.blockUser = async (req, res, next) => {

    try {

        const { blockedUserId, reason } = req.body;
        const userId = req.user.userId;

        if (userId === blockedUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot block yourself"
            });
        }

        const alreadyBlocked = await UserBlock.findOne({
            userId,
            blockedUserId
        });

        if (alreadyBlocked) {
            return res.status(400).json({
                success: false,
                message: "User already blocked"
            });
        }

        const block = await UserBlock.create({
            userId,
            blockedUserId,
            reason
        });

        await BlockLog.create({
            action: "BLOCK",
            userId,
            targetUserId: blockedUserId,
            reason,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.json({
            success: true,
            message: "User blocked successfully",
            data: {
                id: block.id,
                userId: block.userId,
                reason: block.reason,
                createdAt: block.createdAt,
            }
        });

    } catch (err) {
        next(err);
    }

};



// UNBLOCK USER
exports.unblockUser = async (req, res, next) => {

    try {

        const { blockedUserId } = req.body;
        const userId = req.user.userId;

        const block = await UserBlock.findOneAndDelete({
            userId,
            blockedUserId
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "User not blocked"
            });
        }

        await BlockLog.create({
            action: "UNBLOCK",
            userId,
            targetUserId: blockedUserId,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.json({
            success: true,
            message: "User unblocked successfully"
        });

    } catch (err) {
        next(err);
    }

};



// GET BLOCKED USERS
exports.getBlockedUsers = async (req, res, next) => {

    try {

        const userId = req.user.userId;

        const blockedUsers = await UserBlock.find({ userId })
            .populate("blockedUserId", "name avatar email");

        await BlockLog.create({
            action: "GET_LIST",
            userId: userId,
            targetUserId: userId,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        res.json({
            success: true,
            data: blockedUsers
        });

    } catch (err) {
        next(err);
    }

};

