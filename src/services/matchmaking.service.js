const CallQueue = require("../models/call-queue.model");

async function addToQueue(userId, callType, genderPreference) {
    return await CallQueue.create({
        userId,
        callType,
        genderPreference
    })
}


async function findMatch(userId) {
    const match = await CallQueue.findOne({
        status: "waiting",
        userId: { $ne: userId }
    });

    if (!match) return null;

    match.status = "matched";
    await match.save();

    return match;
}


module.exports = {
    addToQueue,
    findMatch
}
