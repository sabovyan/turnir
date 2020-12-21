import joi from '@hapi/joi';

const registerValidationSchema = joi.object({
  userName: joi.string().min(3).max(10).required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export default registerValidationSchema;
