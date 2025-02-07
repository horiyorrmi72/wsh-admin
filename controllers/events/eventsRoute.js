const express = require('express');
const router = express.Router();
const events = require('./eventsController');
const { upload } = require('../../utils/uploads/cloudinary');

router.get('/', events.getEvents);
router.get('/upcoming', events.getUpcomingEvents);
router.post('/create-event', upload.single('image'), events.createEvent);
router.put('/update-event/:id', upload.single('image'), events.updateEvent);
router.delete('/delete-event/:id', events.removeEvent);

module.exports = router;
