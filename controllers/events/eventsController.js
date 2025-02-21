const { default: mongoose } = require('mongoose');
const Event = require('../../models/eventModel');
const { cloudinary } = require('../../utils/uploads/cloudinary');

const paginateResults = async (query, page, limit) => {
	const skip = (page - 1) * limit;
	const results = await query.skip(skip).limit(limit);
	const totalCount = await Event.countDocuments(query.getQuery());

	return {
		data: results,
		pagination: {
			currentPage: page,
			totalPages: Math.ceil(totalCount / limit),
			total: totalCount,
		},
	};
};

const createEvent = async (req, res) => {
	const { title, description, startDate, endDate, registrationUrl, state } =
		req.body;

	if (!title || !startDate || !description) {
		return res
			.status(400)
			.json({ message: 'Event must have a title, description, and a date' });
	}

	try {
		const existingEvent = await Event.findOne({ title }).exec();
		if (existingEvent) {
			return res.status(409).json({ message: 'Event already exists' });
		}

		const imageUrl = req.file ? req.file.path : null;
		const imagePublicId = req.file ? req.file.filename : null;

		const event = new Event({
			title,
			description,
			startDate: new Date(startDate),
			endDate: endDate ? new Date(endDate) : null,
			registrationUrl,
			state: state || 'upcoming',
			imagePath: imageUrl,
			assetPublicId: imagePublicId,
		});

		await event.save();
		return res.status(201).json({ message: 'Event added successfully', event });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: 'Error while adding event', error: error.message });
	}
};

const updateEvent = async (req, res) => {
	const { id } = req.params;
	const { title, description, startDate, endDate, registrationUrl } = req.body;
	const newImagePath = req.file ? req.file.path : undefined;

	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid event ID' });
		}

		const event = await Event.findById(id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}

		// Delete old Cloudinary image if a new image is uploaded
		if (newImagePath && event.assetPublicId) {
			try {
				await cloudinary.api.delete_resources(event.assetPublicId);
			} catch (imageError) {
				console.error(
					'Error deleting old image from Cloudinary:',
					imageError.message
				);
			}
		}

		const updateFields = {
			...(title && { title }),
			...(description && { description }),
			...(startDate && { startDate: new Date(startDate) }),
			...(endDate && { endDate: new Date(endDate) }),
			...(registrationUrl && { registrationUrl }),
			...(newImagePath && { imagePath: newImagePath }),
		};

		const updatedEvent = await Event.findByIdAndUpdate(id, updateFields, {
			new: true,
			runValidators: true,
		});

		return res
			.status(200)
			.json({ message: 'Event updated successfully', event: updatedEvent });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: 'Error updating event', error: error.message });
	}
};

const removeEvent = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res
			.status(400)
			.json({ message: 'Please provide an event ID to delete' });
	}

	try {
		const deletedEvent = await Event.findByIdAndDelete(id);
		if (!deletedEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}

		if (deletedEvent.assetPublicId) {
			try {
				await cloudinary.api.delete_resources(deletedEvent.assetPublicId);
			} catch (imageError) {
				console.error(
					'Error deleting image from Cloudinary:',
					imageError.message
				);
			}
		}

		return res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: 'Error deleting event', error: error.message });
	}
};

const getEvents = async (req, res) => {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = parseInt(req.query.limit) || 10;

		const results = await paginateResults(Event.find(), page, limit);
		return res
			.status(200)
			.json({ message: 'Events fetched successfully', ...results });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: 'Error fetching events', error: error.message });
	}
};

const getEventsById = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid Event ID' });
	}

	try {
		const event = await Event.findById(id);
		if (!event) {
			return res.status(404).json({ message: 'Event not found' });
		}
		return res
			.status(200)
			.json({ message: 'Event fetched successfully', data: event });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: 'Internal server error', error: error.message });
	}
};

const getUpcomingEvents = async (req, res) => {
	try {
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = parseInt(req.query.limit) || 10;

		const results = await paginateResults(
			Event.find({ startDate: { $gte: new Date() }, state: 'upcoming' }),
			page,
			limit
		);
		return res
			.status(200)
			.json({ message: 'Fetched Upcoming Events Successfully.', ...results });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({
				message: 'Error fetching upcoming events.',
				error: error.message,
			});
	}
};

const updateEventStates = async () => {
	try {
		const events = await Event.updateMany(
			{ startDate: { $lt: new Date() } },
			{ $set: { state: 'completed' } }
		);

		console.log(events);
	} catch (error) {
		console.error('Error updating event states:', error.message);
	}
};

const getCompletedEvents = async (req, res) => {
	try {
		await updateEventStates();
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = parseInt(req.query.limit) || 10;

		const results = await paginateResults(
			Event.find({ startDate: { $lt: new Date() } }),
			page,
			limit
		);
		return res
			.status(200)
			.json({ message: 'Fetched Completed Events Successfully.', ...results });
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({
				message: 'Error fetching completed events.',
				error: error.message,
			});
	}
};

module.exports = {
	getEvents,
	removeEvent,
	updateEvent,
	createEvent,
	getUpcomingEvents,
	getCompletedEvents,
	getEventsById,
};
