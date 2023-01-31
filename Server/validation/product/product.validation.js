const Joi = require("joi");
const validate = require("../validate");

const productSchema = Joi.object({
  name: Joi.string().min(2).max(256).required().trim(),
  price: Joi.string().required(),
  description: Joi.array().required(),
  image: Joi.array().required(),
  quantity: Joi.number().required(),
});

const editSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(256).required().trim(),
  price: Joi.string().max(64).required(),
  description: Joi.array().required(),
  image: Joi.array().required(),
  quantity: Joi.number().max(64).required(),
  delImages: Joi.array().required(),
});

const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const reviewSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  description: Joi.array().required(),
  rating: Joi.number().required(),
});

const validateProduct = (userInfo) => validate(productSchema, userInfo);

const validateEdit = (userInfo) => validate(editSchema, userInfo);

const validateId = (userInfo) => validate(idSchema, userInfo);

const validateReview = (userInfo) => validate(reviewSchema, userInfo);

module.exports = { validateProduct, validateEdit, validateId, validateReview };
