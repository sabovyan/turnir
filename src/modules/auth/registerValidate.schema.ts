import joi from '@hapi/joi';

const registerValidationSchema = joi.object({
  displayName: joi.string().trim().min(3).max(20).required(),
  email: joi.string().lowercase().trim().email().required(),
  password: joi
    .string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
      ),
    )
    .required(),
});

export default registerValidationSchema;
