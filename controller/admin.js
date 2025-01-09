const { Admin } = require("../models");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");

/*
 * Login admin: POST http://localhost:5500/admin/login
 */
const login = (req, res, next) => {
    Admin.login(req.body)
        .then((result) => {
            if (result.status) {
                // Create JWT token
                const tokenKey = readFileSync("./configuration/private.key");
                const token = jwt.sign(
                    { _admin_id: result.data._id },
                    tokenKey,
                    { expiresIn: "1h" }
                );

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

module.exports = { login };
