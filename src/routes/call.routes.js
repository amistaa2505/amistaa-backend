const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/call/start:
 *   post:
 *     summary: Start a call
 *     description: Start matchmaking call between users
 *     tags:
 *       - Call
 *     responses:
 *       200:
 *         description: Call started successfully
 */
router.post("/start", (req, res) => {
    res.json({ message: "Call started" });
});

module.exports = router;