const express = require('express');
const router = express.Router();
const { verify, initiatePayments, paymentWebhook } = require('./payment_verification');

router.post('', (req, res) =>
	res.send('Kindly use the other endpoint to verify the payment details.')
);
router.post('/initiate', initiatePayments);
router.post('/webhook', paymentWebhook);

router.post('/verify', verify);

module.exports = router;
