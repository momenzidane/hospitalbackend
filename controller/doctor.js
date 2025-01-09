const { Doctor } = require("../models");
const { dbConnection } = require("../configuration");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");
const path = require("path");

/*
 * Rigester a new doctor
 * POST: http://localhost:5500/doctor/signup
 */
const signup = (req, res, next) => {
    const doctorData = req.body;

    // Validation
    const validation = Doctor.validate(doctorData);
    if (validation.error) {
        return next(createError(400, validation.error.message));
    }

    // Check if doctor exists
    const doctor = new Doctor(doctorData);
    doctor.isExist()
        .then((result) => {
            if (result.check) {
                return next(createError(409, result.message));
            }
            // Insert data
            doctor.save((result) => {
                if (result.status) {
                    return returnJson(res, 201, true, "Doctor has been created successfully", result.data);
                }
                return next(createError(500, result.message));
            });
        })
        .catch((err) => {
            return next(createError(500, err.message));
        });
};

/*
 * Login doctor
 * POST: http://localhost:5500/doctor/login
 */
const login = (req, res, next) => {
    Doctor.login(req.body)
        .then((result) => {
            if (result.status) {
                // Generate JWT token
                const tokenKey = readFileSync("./configuration/private.key");
                const token = jwt.sign(
                    {
                        _doctor_id: result.data._id,
                        role: "Doctor", // Add role to token
                    },
                    tokenKey,
                    { expiresIn: "1h" } // Token validity
                );

                // Return token
                return res.status(200).json({
                    status: true,
                    message: "Login successful.",
                    token,
                });
            }
            return next(createError(result.code, result.message));
        })
        .catch((err) => {
            return next(createError(500, err.message));
        });
};

/*
 * Doctor Dashboard
 * GET: http://localhost:5500/doctor/dashboard
 */
const dashboard = (req, res, next) => {
    try {
        // Send the HTML file for the doctor dashboard
        res.sendFile(path.join(__dirname, "../views/doctor-dashboard.html"));
    } catch (error) {
        return next(createError(500, "Error loading dashboard."));
    }
};

/*
 * Get all doctors with pagination
 * GET: http://localhost:5500/doctor?page=1
 */
const getAllDoctor = (req, res, next) => {
    dbConnection("doctor", async (collection) => {
        try {
            const pageNum = parseInt(req.query.page);

            if (isNaN(pageNum)) {
                return next(createError(400, "The value of ?page='must be an integer'"));
            }

            /*
                page  limet  skip
                1      10    0
                2      10    10
                3      10    20
            */
            const limit = 3;
            const skip = (pageNum - 1) * limit;

            const doctors = await collection.find({}).limit(limit).skip(skip).toArray();
            return returnJson(res, 200, true, "", doctors);
        } catch (error) {
            return next(createError(401, error.message));
        }
    });
};

module.exports = {
    signup,
    login,
    dashboard, // أضف الدالة هنا
    getAllDoctor,
};
