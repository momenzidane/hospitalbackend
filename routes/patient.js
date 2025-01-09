
const { Router } = require('express');
const { patientController } = require('../controller'); 

const router = Router();

router.post('/signup', patientController.signup)
      .post('/login', patientController.login)
      .get('/', patientController.getAllPatients)
      .post('/update-medical-reports', patientController.updateMedicalReports);

module.exports = router;
