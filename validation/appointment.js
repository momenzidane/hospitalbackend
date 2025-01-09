const Joi = require('@hapi/joi');

// Schema لإنشاء موعد
const schemaAppointment = Joi.object({
    patientName: Joi.string().required().messages({
        'string.empty': 'Patient name is required',
    }),
    patientEmail: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Patient email is required',
    }),
    doctorName: Joi.string().required().messages({
        'string.empty': 'Doctor name is required',
    }),
    appointmentDate: Joi.date().greater('now').required().messages({
        'date.greater': 'Appointment date must be in the future',
        'date.base': 'Invalid appointment date',
        'any.required': 'Appointment date is required',
    }),
    appointmentTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.pattern.base': 'Appointment time must be in HH:mm format',
            'string.empty': 'Appointment time is required',
        }),
});

module.exports = { schemaAppointment };
