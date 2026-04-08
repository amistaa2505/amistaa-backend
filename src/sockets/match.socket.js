const queue = [];

module.exports = function matchSocket(io) {

    io.on("connection", (socket) => {

        socket.on("join_queue", () => {

            queue.push(socket.id);

            if (queue.length >= 2) {

                const user1 = queue.shift();
                const user2 = queue.shift();

                io.to(user1).emit("match_found", { partner: user2 });
                io.to(user2).emit("match_found", { partner: user1 });

            }

        });

        socket.on("leave_queue", () => {

            const index = queue.indexOf(socket.id);

            if (index !== -1) {
                queue.splice(index, 1);
            }

        });

    });

};