const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");

const userController = require("../controllers/user.controller");

const {
    updateProfileSchema,
    updateLocationSchema,
    updateInterestsSchema,
    searchUserSchema
} = require("../validators/user.validator");


router.get(
    "/me",
    authMiddleware,
    userController.getMe
);

router.put(
    "/me",
    authMiddleware,
    validate(updateProfileSchema),
    userController.updateMe
);

router.post(
    "/me/photo",
    authMiddleware,
    upload.single("avatar"),
    userController.uploadPhoto
);

router.patch(
    "/me/location",
    authMiddleware,
    validate(updateLocationSchema),
    userController.updateLocation
);

router.patch(
    "/me/interests",
    authMiddleware,
    validate(updateInterestsSchema),
    userController.updateInterests
);

router.get(
    "/search",
    authMiddleware,
    validate(searchUserSchema),
    userController.searchUsers
);

router.get(
    "/nearby",
    authMiddleware,
    userController.nearbyUsers
);

module.exports = router;
