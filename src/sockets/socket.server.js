const { Server } = require("socket.io");

const socketAuth = require("./middleware/socketAuth");
const socketRateLimit = require("./middleware/socketRateLimit");

const callSocket = require("./call.socket");
const matchSocket = require("./match.socket");

function initSocket(server) {

    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    // AUTH
    io.use(socketAuth);

    io.on("connection", (socket) => {

        socketRateLimit(socket);

    });

    // FEATURES
    callSocket(io);
    matchSocket(io);

    return io;

}

module.exports = initSocket;