const express = require('express');
const router = express.Router();
const events = require('./eventsController');
const { upload } = require('../../utils/uploads/cloudinary');
const { auth, isAdmin } = require('../auth/authUtils');

router.get('/', events.getEvents);
router.get('/eventby-id/:id', events.getEventsById);
router.get('/upcoming-event', events.getUpcomingEvents);
router.get('/completed-event', events.getCompletedEvents);
router.post(
	'/create-event',
	auth,
	isAdmin,
	upload.single('image'),
	events.createEvent
);
router.put(
	'/update-event/:id',
	auth,
	isAdmin,
	upload.single('image'),
	events.updateEvent
);
router.delete('/delete-event/:id', auth, isAdmin, events.removeEvent);

module.exports = router;
