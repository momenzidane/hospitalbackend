// const {readFileSync}= require('fs');
// const jwt = require('jsonwebtoken');
// const createError = require('http-errors');


// module.exports = (req,res,next) => {
//     const authHeader = req.get('Authorization')

//     if (!authHeader) {
//         return next(createError(401))
//     }
//     const token = authHeader.split(' ')[1]

//     const secretKey = readFileSync('./configuration/private.key') 

//     try { 
//         const decode = jwt.verify(token,secretKey);

//         req._user_id = decode._user_id;
//         req._reviewer_id = decode._reviewer_id;
//         next()

//     } catch (error) {
//        return next(createError(401))
//     }
  
// }

const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");

class AuthMiddleware {
    constructor() {
        this.secretKey = readFileSync("./configuration/private.key"); // مفتاح JWT السري
    }

    // Middleware للتحقق من التوكن
    verifyToken(req, res, next) {
        try {
            // استخراج التوكن من الهيدر
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                return res.status(401).json({
                    status: false,
                    message: "Access denied. No token provided.",
                });
            }

            const token = authHeader.split(" ")[1]; // Bearer <token>
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: "Token is missing.",
                });
            }

            // التحقق من التوكن
            const decoded = jwt.verify(token, this.secretKey);
            req.user = decoded; // إضافة البيانات المفككة من التوكن إلى الطلب
            next(); // متابعة الطلب
        } catch (err) {
            return res.status(403).json({
                status: false,
                message: "Invalid or expired token.",
            });
        }
    }

    // Middleware للسماح فقط للمستخدمين من نوع معين (Admin, Doctor, Patient)
    allowRole(role) {
        return (req, res, next) => {
            if (req.user && req.user.role === role) {
                next();
            } else {
                return res.status(403).json({
                    status: false,
                    message: `Access denied. Only ${role}s are allowed.`,
                });
            }
        };
    }
}

module.exports = new AuthMiddleware();
