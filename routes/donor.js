const {Router} = require('express');
const {donorController} = require('../controller'); // Corrected import


const router = Router();

router.post('/signup', donorController.signup)
      .post('/login', donorController.login)
      .get('/',donorController.getAllDonor)
      .get('/pages',donorController.getCountOfPageDonor)
      .get('/:bloodType',donorController.sershBloodType)
      .get('/search/:address',donorController.searchAddress)
      .get('/:id',donorController.getDonorById)
module.exports = router; 
