const { dbConnection } = require("../configuration");
const { adminLogin } = require("../validation");
const { compareSync } = require("bcryptjs");

// Class Admin
class Admin {
    constructor(adminData) {
        this.adminData = adminData;
    }

    // Function for login
    static login(loginData) {
        return new Promise((resolve, reject) => {
            // Validate login data
            const validation = adminLogin.validate(loginData);
            if (validation.error) {
                resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400,
                });
                return;
            }

            // Check the database for admin credentials
            dbConnection("admin", async (collection) => {
                try {
                    // Find the admin by email
                    const admin = await collection.findOne({
                        email: loginData.email,
                    });

                    if (!admin || !compareSync(loginData.password, admin.password)) {
                        // If admin is not found or password doesn't match
                        resolve({
                            status: false,
                            message: "Login failed, invalid credentials",
                            code: 401,
                        });
                        return;
                    }

                    // Successful login
                    resolve({
                        status: true,
                        data: admin,
                        message: "Login successful",
                        code: 200,
                    });
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
}

module.exports = Admin;
