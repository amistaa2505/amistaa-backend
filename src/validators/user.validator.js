const Joi = require("joi");

exports.registerSchema = Joi.object({
    username: Joi.string().min(5).required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone must be 10 digits"
        }),
    password: Joi.string().min(6).required()
});

exports.updateProfileSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30),

    email: Joi.string()
        .email(),

    gender: Joi.string()
        .valid("male", "female", "other"),

    bio: Joi.string()
        .max(200),
});

exports.updateRoleSchema = Joi.object({
    role: Joi.string().valid("user", "creator")
});

exports.updateLocationSchema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    city: Joi.string().optional(),
    country: Joi.string().optional()
});

exports.updateInterestsSchema = Joi.object({
    interests: Joi.array().items(Joi.string()).max(10).required()
});

exports.searchUserSchema = Joi.object({
    keyword: Joi.string().min(1).required()
});
