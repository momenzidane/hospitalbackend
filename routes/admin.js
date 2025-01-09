// const {Router} = require('express');
// const {adminController} = require('../controller'); // Corrected import


// const router = Router();

// router.post('/login', adminController.login)

// module.exports = router; 


const { Router } = require("express");
const { adminController } = require("../controller");
const auth = require("../middleware/auth");

const router = Router();

router.post("/login", adminController.login);

// حماية الوصول إلى لوحة التحكم الخاصة بالمشرفين
router.get(
    "/dashboard",
    auth.verifyToken, // التحقق من التوكن
    auth.allowRole("Admin"), // السماح فقط للمشرفين
    (req, res) => {
        res.sendFile(path.join(__dirname, "../../hospital-website/admin-dashboard.html"));
    }
);

module.exports = router;
