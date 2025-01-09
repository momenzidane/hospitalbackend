const { dbConnection } = require("../configuration");
const { patientLogin, patientRegester } = require("../validation");
const { hashSync, compareSync } = require("bcryptjs");

// Class Patient
class Patient {
    constructor(patientData) {
        this.patientData = patientData;
    }

    // Function to save patient data
    save(cb) {
        dbConnection("patient", async (collection) => {
            try {
                // Hash the password before saving
                const hashPassword = hashSync(this.patientData.password, 10);
                this.patientData.password = hashPassword;

                // Parse medical reports from string to array
                this.patientData.medicalReports = this.patientData.medicalReports
                    .split(',')
                    .map((link) => link.trim());

                // Insert the patient data into the database
                const patient = await collection.insertOne(this.patientData);
                if (patient) {
                    cb({
                        status: true,
                        data: this.patientData,
                    });
                } else {
                    cb({
                        status: false,
                        message: "Failed to register patient",
                    });
                }
            } catch (error) {
                cb({
                    status: false,
                    message: error.message,
                });
            }
        });
    }

    // Static function to validate patient registration data
    static validate(patientData) {
        try {
            const validationResult = patientRegester.validate(patientData);
            return validationResult;
        } catch (error) {
            return {
                status: false,
                message: "Validation error occurred",
            };
        }
    }

    // Function to check if patient already exists
    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection("patient", async (collection) => {
                try {
                    const patient = await collection.findOne({
                        email: this.patientData.email,
                    });

                    if (!patient) {
                        resolve({
                            check: false,
                        });
                    } else {
                        resolve({
                            check: true,
                            message: "The email is already in use",
                        });
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    // Function to log in a patient
    static login(loginData) {
        return new Promise((resolve, reject) => {
            const validation = patientLogin.validate(loginData);
            if (validation.error) {
                resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400,
                });
            }

            dbConnection("patient", async (collection) => {
                try {
                    const patient = await collection.findOne({
                        email: loginData.email,
                    });

                    if (!patient || !compareSync(loginData.password, patient.password)) {
                        resolve({
                            status: false,
                            message: "Login failed, invalid credentials",
                            code: 401,
                        });
                    } else {
                        resolve({
                            status: true,
                            data: patient,
                            message: "Login successful",
                            code: 200,
                        });
                    }
                } catch (error) {
                    reject({
                        status: false,
                        message: error.message,
                        code: 500,
                    });
                }
            });
        });
    }

    // Function to update medical reports
    static updateMedicalReports(patientId, medicalReports) {
        return new Promise((resolve, reject) => {
            dbConnection("patient", async (collection) => {
                try {
                    const result = await collection.updateOne(
                        { _id: patientId },
                        {
                            $set: {
                                medicalReports: medicalReports.split(',').map((link) => link.trim()),
                            },
                        }
                    );

                    if (result.modifiedCount > 0) {
                        resolve({
                            status: true,
                            message: "Medical reports updated successfully",
                        });
                    } else {
                        resolve({
                            status: false,
                            message: "Failed to update medical reports",
                        });
                    }
                } catch (error) {
                    reject({
                        status: false,
                        message: error.message,
                    });
                }
            });
        });
    }
}

module.exports = Patient;
