const UserBlock = require("../models/block.model");

exports.isBlocked = async (userA, userB) => {

    const block = await UserBlock.findOne({
        isActive: true,
        $or: [
            { userId: userA, blockedUserId: userB },
            { userId: userB, blockedUserId: userA },
            { blockedUserId: userA }, // global/system blocks
            { blockedUserId: userB }
        ]
    });

    return !!block;
};
