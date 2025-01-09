const { Patient } = require("../models");
const { dbConnection } = require("../configuration");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");

/*
 * Register a new patient: POST http://localhost:5500/patient/signup
 */
const signup = (req, res, next) => {
    const patientData = req.body;

    // Validation
    const validation = Patient.validate(patientData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    // Check if patient already exists
    const patient = new Patient(patientData);
    patient.isExist()
        .then((result) => {
            if (result.check) {
                return next(createError(409, result.message));
            }

            // Insert data into the database
            patient.save((result) => {
                if (result.status) {
                    return res.status(201).json({
                        status: true,
                        message: "Patient has been created successfully",
                        data: result.data,
                    });
                }
                return next(createError(500, result.message));
            });
        })
        .catch((err) => {
            return next(createError(500, err.message));
        });
};

/*
 * Login patient: POST http://localhost:5500/patient/login
 */
const login = (req, res, next) => {
    Patient.login(req.body)
        .then((result) => {
            if (result.status) {
                // Create JWT token
                const tokenKey = readFileSync("./configuration/private.key");
                const token = jwt.sign(
                    {
                        _patient_id: result.data._id,
                    },
                    tokenKey,
                    { expiresIn: "1h" } // Token expiration set to 1 hour
                );

                return res.status(200).json({
                    status: true,
                    message: "Login successful",
                    token,
                });
            }
            return next(createError(result.code, result.message));
        })
        .catch((err) => {
            return next(createError(401, err.message));
        });
};

/*
 * Get all patients with pagination: GET http://localhost:5500/patient?page=1
 */
const getAllPatients = (req, res, next) => {
    dbConnection("patient", async (collection) => {
        try {
            const pageNum = parseInt(req.query.page);

            if (isNaN(pageNum)) {
                return next(createError(400, "The value of ?page must be an integer"));
            }

            // Pagination settings
            const limit = 10; // Number of patients per page
            const skip = (pageNum - 1) * limit;

            // Fetch patients from the database
            const patients = await collection.find({}).limit(limit).skip(skip).toArray();

            return res.status(200).json({
                status: true,
                message: "Patients fetched successfully",
                data: patients,
            });
        } catch (error) {
            return next(createError(500, error.message));
        }
    });
};

/*
 * Update medical reports for a patient: POST http://localhost:5500/patient/update-medical-reports
 */
const updateMedicalReports = (req, res, next) => {
    const { patientId, medicalReports } = req.body;

    if (!patientId || !medicalReports) {
        return next(createError(400, "Both patientId and medicalReports are required"));
    }

    Patient.updateMedicalReports(patientId, medicalReports)
        .then((result) => {
            if (!result.status) {
                return next(createError(400, result.message));
            }
            res.status(200).json({
                status: true,
                message: result.message,
            });
        })
        .catch((err) => {
            return next(createError(500, err.message));
        });
};

module.exports = {
    signup,
    login,
    getAllPatients,
    updateMedicalReports,
};
