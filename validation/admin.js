const Joi = require('@hapi/joi');

const loginSchemaAdmin = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'string.empty': 'Email is required.',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required.',
    }),
});

module.exports = { loginSchemaAdmin };
