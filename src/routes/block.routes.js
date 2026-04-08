const express = require("express");
const router = express.Router();

const {
    blockUser,
    unblockUser,
    getBlockedUsers
} = require("../controllers/block.controller");

const authMiddleware = require("../middlewares/auth.middleware");

router.post("/block", authMiddleware, blockUser);

router.post("/unblock", authMiddleware, unblockUser);

router.get("/blocked-users", authMiddleware, getBlockedUsers);

module.exports = router;
