// const {Router} = require('express');
// const {doctorController} = require('../controller'); // Corrected import


// const router = Router();

// router.post('/signup', doctorController.signup)
//       .post('/login', doctorController.login)

// module.exports = router; 

const { Router } = require("express");
const { doctorController } = require("../controller");
const auth = require("../middleware/auth");

const router = Router();

router.post("/signup", doctorController.signup); // مسار تسجيل الطبيب
router.post("/login", doctorController.login); // مسار تسجيل الدخول للطبيب
router.get("/dashboard", auth.verifyToken, doctorController.dashboard); // مسار لوحة التحكم

module.exports = router;

