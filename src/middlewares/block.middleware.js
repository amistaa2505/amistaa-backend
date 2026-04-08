const UserBlock = require("../models/block.model");

module.exports = async (req, res, next) => {

    try {

        const userId = req.user.userId;

        const block = await UserBlock.findOne({
            blockedUserId: userId,
            isActive: true
        });

        if (!block) return next();

        // ⏳ TEMP BLOCK EXPIRE CHECK
        if (block.type === "temporary" && block.expiresAt < new Date()) {
            block.isActive = false;
            await block.save();
            return next();
        }

        // 👻 SHADOW BLOCK → allow but degrade experience
        if (block.type === "shadow") {
            req.isShadowBlocked = true;
            return next();
        }

        // 🚫 HARD BLOCK
        return res.status(403).json({
            success: false,
            message: "Your account is restricted",
            type: block.type
        });

    } catch (err) {
        next(err);
    }

};