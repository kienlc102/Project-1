const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/', checkoutController.getAllCheckouts);
router.post('/', checkoutController.createCheckout);

module.exports = router;