const { dbConnection } = require("../configuration");
const { doctorLogin, doctorRegester } = require("../validation");
const { hashSync, compareSync } = require("bcryptjs");

// Class Doctor
class Doctor {
    constructor(doctorData) {
        this.doctorData = doctorData;
    }

    // Function to register a doctor
    save(cb) {
        dbConnection("doctor", async (collection) => {
            try {
                // Hash the password before saving
                const hashPassword = hashSync(this.doctorData.password, 10);
                this.doctorData.password = hashPassword;

                // Parse certificates from string to array
                this.doctorData.certificates = this.doctorData.certificates
                    .split(',')
                    .map((link) => link.trim());

                // Insert the doctor data into the database
                const doctor = await collection.insertOne(this.doctorData);
                if (doctor) {
                    cb({
                        status: true,
                        data: this.doctorData,
                    });
                } else {
                    cb({
                        status: false,
                        message: "Failed to register doctor",
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

    // Static function to validate doctor registration data
    static validate(doctorData) {
        try {
            const validationResult = doctorRegester.validate(doctorData);
            return validationResult;
        } catch (error) {
            return {
                status: false,
                message: "Validation error occurred",
            };
        }
    }

    // Check if doctor already exists
    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection("doctor", async (collection) => {
                try {
                    const doctor = await collection.findOne({
                        email: this.doctorData.email,
                    });

                    if (!doctor) {
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

    // Function to log in a doctor
    static login(loginData) {
        return new Promise((resolve, reject) => {
            // Validate login data
            const validation = doctorLogin.validate(loginData);
            if (validation.error) {
                resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400,
                });
            }

            dbConnection("doctor", async (collection) => {
                try {
                    // Find doctor by email
                    const doctor = await collection.findOne({
                        email: loginData.email,
                    });

                    if (!doctor || !compareSync(loginData.password, doctor.password)) {
                        // If doctor not found or password doesn't match
                        resolve({
                            status: false,
                            message: "Login failed, invalid credentials",
                            code: 401,
                        });
                    } else {
                        // Successful login
                        resolve({
                            status: true,
                            data: doctor,
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

    // Function to update certificates
    static updateCertificates(doctorId, certificates) {
        return new Promise((resolve, reject) => {
            dbConnection("doctor", async (collection) => {
                try {
                    const result = await collection.updateOne(
                        { _id: doctorId },
                        {
                            $set: {
                                certificates: certificates.split(',').map((link) => link.trim()),
                            },
                        }
                    );

                    if (result.modifiedCount > 0) {
                        resolve({
                            status: true,
                            message: "Certificates updated successfully",
                        });
                    } else {
                        resolve({
                            status: false,
                            message: "Failed to update certificates",
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

module.exports = Doctor;
