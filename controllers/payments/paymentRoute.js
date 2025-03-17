const express = require('express');
const router = express.Router();
const { verify, initiatePayments } = require('./payment_verification');

router.post('', (req, res) =>
	res.send('Kindly use the other endpoint to verify the payment details.')
);
router.post('/initiate', initiatePayments);
router.post('/verify', verify);

module.exports = router;
