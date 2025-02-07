const express = require('express');
const router = express.Router();

const { signup, signin } = require('./authController');

router.post('/register', signup);
router.post('/login', signin);

module.exports = router;
