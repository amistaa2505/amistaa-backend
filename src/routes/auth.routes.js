const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

const validate = require("../middlewares/validate.middleware");
const otpLimiter = require("../middlewares/otpLimiter.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const {
    sendOtpSchema,
    verifyOtpSchema,
    logoutSchema,
    deleteSchema
} = require("../validators/auth.validator");


router.post(
    "/send-otp",
    otpLimiter,
    validate(sendOtpSchema),
    authController.sendOtp
);

router.post(
    "/verify-otp",
    validate(verifyOtpSchema),
    authController.verifyOtp
);

router.post(
    "/firebase",
    authController.firebaseLogin,
);

router.post(
    "/logout",
    authMiddleware,
    validate(logoutSchema),
    authController.logout
);

router.post(
    "/delete-account",
    validate(deleteSchema),
    authController.deleted
);

router.post(
    "/refresh-token",
    authController.refreshToken
);

module.exports = router;
