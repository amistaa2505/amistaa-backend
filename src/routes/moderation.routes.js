const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const adminController = require("../controllers/admin.controller");


// 📊 Reports
router.get(
    "/reports",
    authMiddleware,
    adminMiddleware,
    adminController.getReports
);


// 🚫 Moderation Actions (ALL IN ONE PLACE)

// TEMP BLOCK
router.post(
    "/block/temp",
    authMiddleware,
    adminMiddleware,
    adminController.tempBlockUser
);

// SHADOW BLOCK
router.post(
    "/block/shadow",
    authMiddleware,
    adminMiddleware,
    adminController.shadowBlockUser
);

// GLOBAL BLOCK
router.post(
    "/block/global",
    authMiddleware,
    adminMiddleware,
    adminController.globalBlockUser
);

// UNBLOCK (ADMIN)
router.post(
    "/block/unblock",
    authMiddleware,
    adminMiddleware,
    adminController.adminUnblockUser
);


// 📜 Logs
router.get(
    "/logs",
    authMiddleware,
    adminMiddleware,
    adminController.getBlockLogs
);

module.exports = router;
