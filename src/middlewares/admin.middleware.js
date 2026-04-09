module.exports = (req, res, next) => {
    try {

        // Make sure auth middleware runs before this
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Example role check
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
            });
        }

        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};