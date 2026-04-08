const UserReport = require("../models/report.model");
const moderationService = require("../services/moderation.service");

exports.reportUser = async (req, res, next) => {

    try {

        const { reportedUserId, reason, details } = req.body;
        const reporterId = req.user.userId;

        const report = await UserReport.create({
            reporterId,
            reportedUserId,
            reason,
            details
        });

        // 🔥 AUTO BLOCK CHECK
        await moderationService.handleAutoBlock(reportedUserId);

        res.json({
            success: true,
            message: "User reported successfully",
            data: report
        });

    } catch (err) {
        next(err);
    }

};