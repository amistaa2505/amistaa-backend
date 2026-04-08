const matchmakingService = require("../models/matchmaking.model");


async function startCall(req, res) {

    const { userId, callType } = req.body;

    await matchmakingService.addToQueue(userId, callType);

    const match = await matchmakingService.findMatch(userId);

    if (!match) {
        return res.json({
            message: "Waiting for match"
        });
    }

    res.json({
        message: "Match found",
        match
    });

}


module.exports = {
    startCall
};

