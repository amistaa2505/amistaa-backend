const OnlineUser = require("../models/user-online-status.model");

async function setOnline(userId, socketId) {
    await OnlineUser.findOneAndUpdate(
        { userId },
        {
            isOnline: true,
            socketId,
            lastSeen: new Date()
        },
        { upsert: true }
    );
}

async function setOffline(userId) {

    await OnlineUser.findOneAndUpdate(
        { userId },
        { isOnline: false, lastSeen: new Date() }
    );

}


module.exports = {
    setOnline,
    setOffline
}
