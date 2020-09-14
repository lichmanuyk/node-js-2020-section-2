import Joi from '@hapi/joi';

export const groupPostSchema = Joi.object().keys({
  name: Joi.string().required(),
  permissions: Joi.array().items('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES').required(),
});

export const uniqueGroupNameSchema = Joi.array().unique(
  (a, b) => a.name === b.name
);
