const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');

router.get('/', checkinController.getAllCheckins);
router.post('/', checkinController.createCheckin);

module.exports = router;