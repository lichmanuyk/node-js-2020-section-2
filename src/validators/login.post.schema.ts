import Joi from '@hapi/joi';

export const loginPostSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .required()
});
