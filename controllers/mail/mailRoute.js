const express = require('express');
const router = express.Router();
const mailer = require('./mailController');



router.get('/contact-mail', mailer.receiveMail);


module.exports = router;
