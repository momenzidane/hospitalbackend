const Joi = require('@hapi/joi');

// Schema لتسجيل الطبيب
const schemaDoctor = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'))
        .required()
        .messages({
            'string.pattern.base':
                'Password must include at least one uppercase letter, one lowercase letter, one number, and must be at least 8 characters long',
            'string.empty': 'Password is required',
        }),
    specialization: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Specialization must be at least 3 characters',
        'string.max': 'Specialization must be at most 50 characters',
        'string.empty': 'Specialization is required',
    }),
    certificates: Joi.string()
        .required()
        .custom((value, helpers) => {
            const links = value.split(',').map((link) => link.trim());
            const isValid = links.every((link) =>
                /^https?:\/\/.+$/.test(link)
            );
            if (!isValid) {
                return helpers.message('Certificates must contain valid URLs separated by commas');
            }
            return value;
        })
        .messages({
            'string.empty': 'Certificates are required',
        }),
});

// Schema لتسجيل الدخول للطبيب
const loginSchemaDoctor = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

module.exports = { schemaDoctor, loginSchemaDoctor };
