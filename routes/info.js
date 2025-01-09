const {Router} = require('express');
const {infoController} = require('../controller'); // Corrected import


const router = Router();

router.post('/add', infoController.addData)
      .get('/',infoController.getAllInfo)
module.exports = router; 
