const activeUsers = new Map();

module.exports = function callSocket(io) {

    io.on("connection", (socket) => {

        const userId = socket.user.id;

        activeUsers.set(userId, socket.id);

        socket.join(userId);

        console.log("User connected:", userId);


        socket.on("call_user", ({ to }) => {

            if (userId === to) return;

            if (!activeUsers.has(to)) {
                return socket.emit("user_offline");
            }

            io.to(to).emit("incoming_call", {
                from: userId
            });

        });


        socket.on("accept_call", ({ to }) => {

            io.to(to).emit("call_accepted", {
                from: userId
            });

        });


        socket.on("disconnect", () => {

            activeUsers.delete(userId);

            console.log("User disconnected:", userId);

        });

    });

};