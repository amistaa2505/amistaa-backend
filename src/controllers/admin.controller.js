const UserReport = require("../models/report.model");
const UserBlock = require("../models/block.model");
const BlockLog = require("../models/block-log.model");
const moderationService = require("../services/moderation.service");


// 📊 GET REPORTS
exports.getReports = async (req, res) => {

    const reports = await UserReport.find()
        .populate("reporterId reportedUserId", "name email");

    res.json({ success: true, data: reports });
};


// 🔨 TEMP BLOCK
exports.tempBlockUser = async (req, res) => {

    const { userId, minutes, reason } = req.body;

    const block = await moderationService.createTemporaryBlock(
        req.user.userId,
        userId,
        minutes,
        reason
    );

    res.json({ success: true, data: block });
};


// 👻 SHADOW BLOCK
exports.shadowBlockUser = async (req, res) => {

    const { userId, reason } = req.body;

    const block = await moderationService.createShadowBlock(
        req.user.userId,
        userId,
        reason
    );

    res.json({ success: true, data: block });
};


// 🌍 GLOBAL BLOCK
exports.globalBlockUser = async (req, res) => {

    const { userId, reason } = req.body;

    const block = await moderationService.createGlobalBlock(
        req.user.userId,
        userId,
        reason
    );

    res.json({ success: true, data: block });
};


// 🔓 ADMIN UNBLOCK USER
exports.adminUnblockUser = async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId is required"
        });
    }

    // Remove all active blocks
    await UserBlock.updateMany(
        { blockedUserId: userId, isActive: true },
        { isActive: false }
    );

    // Log action
    await BlockLog.create({
        adminId: req.user.userId,
        targetUserId: userId,
        action: "unblock",
        reason: "Admin unblock"
    });

    res.json({
        success: true,
        message: "User unblocked successfully"
    });
};

// 📜 BLOCK LOGS
exports.getBlockLogs = async (req, res) => {

    const logs = await BlockLog.find()
        .sort({ createdAt: -1 })
        .limit(100);

    res.json({ success: true, data: logs });
};


