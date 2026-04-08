const Joi = require("joi");

exports.sendOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
});

exports.verifyOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),

    otp: Joi.string()
        .length(6)
        .required()
});

exports.logoutSchema = Joi.object({
    userId: Joi.string().required()
});

exports.deleteSchema = Joi.object({
    userId: Joi.string().required()
});
