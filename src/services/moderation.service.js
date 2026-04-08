const UserReport = require("../models/report.model");
const UserBlock = require("../models/block.model");
const BlockLog = require("../models/block-log.model");

const AUTO_BLOCK_THRESHOLD = 3;


// 🔴 AUTO BLOCK AFTER REPORTS
exports.handleAutoBlock = async (reportedUserId) => {

    const count = await UserReport.countDocuments({
        reportedUserId,
        status: "pending"
    });

    if (count >= AUTO_BLOCK_THRESHOLD) {

        const alreadyBlocked = await UserBlock.findOne({
            blockedUserId: reportedUserId,
            type: "auto",
            isActive: true
        });

        if (!alreadyBlocked) {

            await UserBlock.create({
                blockedUserId: reportedUserId,
                reason: "Auto blocked after multiple reports",
                type: "auto"
            });

            await BlockLog.create({
                action: "BLOCK",
                userId: reportedUserId,
                targetUserId: reportedUserId,
                reason: "AUTO_BLOCK_AFTER_3_REPORTS"
            });

        }
    }

};


// ⏳ TEMPORARY BLOCK
exports.createTemporaryBlock = async (adminId, userId, durationMinutes, reason) => {

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const block = await UserBlock.create({
        blockedUserId: userId,
        reason,
        type: "temporary",
        expiresAt
    });

    await BlockLog.create({
        action: "BLOCK",
        userId: adminId,
        targetUserId: userId,
        reason: `TEMP_BLOCK_${durationMinutes}min`
    });

    return block;
};


// 👻 SHADOW BLOCK
exports.createShadowBlock = async (adminId, userId, reason) => {

    const block = await UserBlock.create({
        blockedUserId: userId,
        reason,
        type: "shadow"
    });

    await BlockLog.create({
        action: "BLOCK",
        userId: adminId,
        targetUserId: userId,
        reason: "SHADOW_BLOCK"
    });

    return block;
};


// 🌍 GLOBAL BLOCK
exports.createGlobalBlock = async (adminId, userId, reason) => {

    const block = await UserBlock.create({
        blockedUserId: userId,
        reason,
        type: "global"
    });

    await BlockLog.create({
        action: "BLOCK",
        userId: adminId,
        targetUserId: userId,
        reason: "GLOBAL_BLOCK"
    });

    return block;
};