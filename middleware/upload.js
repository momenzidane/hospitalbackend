const multer = require('multer');
const path = require('path');

// إعداد التخزين
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // تحديد مسار حفظ الملفات
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // اسم الملف مع التمديد
    },
});

// فلترة الملفات
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']; // الأنواع المسموح بها
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // إذا كان النوع مسموحًا به
    } else {
        cb(new Error('Only PDF, JPEG, or PNG files are allowed.')); // إذا لم يكن النوع مسموحًا به
    }
};

// إنشاء الـ Multer
const upload = multer({
    storage, // إعداد التخزين
    fileFilter, // فلترة الملفات
    limits: { fileSize: 5 * 1024 * 1024 }, // حجم الملف الأقصى: 5 ميجابايت
});

module.exports = upload;
