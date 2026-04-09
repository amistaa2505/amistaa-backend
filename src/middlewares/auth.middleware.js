const jwt = require("jsonwebtoken");
const Session = require("../models/session.model");

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {

        // console.log("JWT ERROR:", err.message);

        // return res.status(401).json({
        //     success: false,
        //     message: "Invalid token"
        // });
        next(err);

    }
};