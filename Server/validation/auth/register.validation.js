const Joi = require("joi");
const validate = require("../validate");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(16).required().trim(),
  email: Joi.string().min(2).max(64).required().trim(),
  password: Joi.string()
    .min(8)
    .max(64)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required()
    .trim(),
});

const validateRegister = (userInfo) => validate(registerSchema, userInfo);

module.exports = { validateRegister };
