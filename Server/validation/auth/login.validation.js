const Joi = require("joi");
const validate = require("../validate");

const loginSchema = Joi.object({
  email: Joi.string().min(2).max(64).required().trim(),
  password: Joi.string().min(8).max(64).required().trim(),
});

const emailSchema = Joi.object({
  email: Joi.string().min(2).max(64).required().trim(),
});

const passwordSchema = Joi.object({
  password: Joi.string()
    .min(2)
    .max(64)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .trim(),
});

const validateLogin = (userInfo) => validate(loginSchema, userInfo);

const validateEmail = (userInfo) => validate(emailSchema, userInfo);

const validatePassword = (userInfo) => validate(passwordSchema, userInfo);

module.exports = { validateLogin, validateEmail, validatePassword };
