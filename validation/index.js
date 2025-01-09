// const { schema, loginschema } = require('./donor'); // Validator for donor
// const { infoSchema } = require('./info'); // Validator for info
// const { schemaAdmin, loginschemaAdmin } = require('./admin'); // Validator for admin
// const { schemaDoctor, loginSchemaDoctor } = require('./doctor'); // Validator for doctor

// module.exports = {
//     donorValidator: schema, // Validator for donor signup
//     loginValidator: loginschema, // Validator for donor login
//     infoValidator: infoSchema, // Validator for info

//     signupschemaAdmin: schemaAdmin, // Validator for admin signup
//     loginschemaAdmin: loginschemaAdmin, // Validator for admin login

//     doctorValidator: schemaDoctor, // Validator for doctor signup
//     doctorLoginValidator: loginSchemaDoctor, // Validator for doctor login
// };


const admin = require('./admin')
const doctor = require('./doctor')
const appointment = require('./appointment')
const patient = require('./patient')



module.exports = {
    adminLogin : admin.loginSchemaAdmin,
    appointement : appointment.schemaAppointment,
    doctorLogin : doctor.loginSchemaDoctor,
    doctorRegester : doctor.schemaDoctor,
    patientLogin : patient.loginSchemaPatient,
    patientRegester : patient.schemaPatient
}

