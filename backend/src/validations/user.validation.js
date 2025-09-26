import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid("user", "admin").default("user"),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  role: Joi.string().valid("user", "admin").optional(),
  password: Joi.string().min(6).optional(),
}).min(1);

export const queryUserSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  role: Joi.string().valid("user", "admin").optional(),
});
