const express = require('express');
const router = express.Router();
const { verify } = require('./payment_verification');

router.post('', (req, res) =>
	res.send('Kindly use the other endpoint to verify the payment details.')
);
router.post('/verify', verify);

module.exports = router;
