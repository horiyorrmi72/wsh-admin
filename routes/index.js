const express = require('express');
const router = express.Router();
const authRoute = require('../controllers/auth/authRoute');
const userRoute = require('../controllers/user/userRoute');
const eventsRoute = require('../controllers/events/eventsRoute');

router.get('/', (req, res) => res.send('Hello World!'));
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/events', eventsRoute);

module.exports = router;
