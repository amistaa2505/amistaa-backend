const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const reportController = require("../controllers/report.controller");
const { reportUserSchema } = require("../validators/report.validator");


router.post(
    "/",
    authMiddleware,
    validate(reportUserSchema),
    reportController.reportUser
);

module.exports = router;
