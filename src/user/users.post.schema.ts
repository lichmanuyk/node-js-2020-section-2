import Joi from '@hapi/joi';

export const userPostSchema = Joi.object().keys({
  login: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required(),
  age: Joi.number().min(5).max(129).required(),
});

export const uniqueLoginSchema = Joi.array().unique(
  (a, b) => a.login === b.login
);
