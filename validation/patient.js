const Joi = require('@hapi/joi');

// Schema لتسجيل المريض
const schemaPatient = Joi.object({
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
    doctorName: Joi.string().required().messages({
        'string.empty': 'Name of doctor is required',
    }),
    medicalReports: Joi.string()
        .required()
        .custom((value, helpers) => {
            const links = value.split(',').map((link) => link.trim());
            const isValid = links.every((link) => /^https?:\/\/.+$/.test(link));
            if (!isValid) {
                return helpers.message('Medical reports must contain valid URLs separated by commas');
            }
            return value;
        })
        .messages({
            'string.empty': 'Medical reports are required',
        }),
});

// Schema لتسجيل الدخول للمريض
const loginSchemaPatient = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

module.exports = { schemaPatient, loginSchemaPatient };
