const express = require('express');
const router = express.Router();
const authRoute = require('../controllers/auth/authRoute');
const userRoute = require('../controllers/user/userRoute');
const eventsRoute = require('../controllers/events/eventsRoute');
const paymentRoute = require('../controllers/payments/paymentRoute');
const publicationRoute = require('../controllers/publications/publicationsRoute');
const mailRoute = require('../controllers/mail/mailRoute');

router.get('/', (req, res) => res.send('Hello World!'));
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/events', eventsRoute);
router.use('/payments', paymentRoute);
router.use('/publications', publicationRoute);
router.use('/mailer', mailRoute);


module.exports = router;
