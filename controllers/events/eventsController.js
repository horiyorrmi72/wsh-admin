const { default: mongoose } = require('mongoose');
const Event = require('../../models/eventModel');
const { cloudinary } = require('../../utils/uploads/cloudinary');

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
		// console.log(req.file)

		const event = new Event({
			title,
			description,
			startDate,
			endDate,
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
	const imagePath = req.file ? req.file.path : undefined;

	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid event ID' });
		}

		const updateFields = {};
		if (title) updateFields.title = title;
		if (description) updateFields.description = description;
		if (startDate) updateFields.startDate = startDate;
		if (endDate) updateFields.endDate = endDate;
		if (registrationUrl) updateFields.registrationUrl = registrationUrl;
		if (imagePath) updateFields.imagePath = imagePath;

		const updatedEvent = await Event.findByIdAndUpdate(id, updateFields, {
			new: true,
			runValidators: true,
		});

		if (!updatedEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}

		return res.status(200).json({
			message: 'Event updated successfully',
			event: updatedEvent,
		});
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
		const deletedEvent = await Event.findById(id);
		if (!deletedEvent) {
			return res.status(404).json({ message: 'Event not found' });
		}

		if (deletedEvent.assetPublicId) {
			try {
				const imagePublicId = deletedEvent.assetPublicId;
				// console.log(imagePublicId);
					// .split('/')
					// .pop()
					// .split('.')[0];
				await cloudinary.api.delete_resources(imagePublicId);
			} catch (imageError) {
				console.error(
					'Error deleting image from Cloudinary:',
					imageError.message
				);
				return res.status(500).json({
					message: 'Error deleting image from Cloudinary',
					error: imageError.message,
				});
			}
		}

		await Event.deleteOne({ _id: id });

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
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		if (page < 1) {
			return res
				.status(400)
				.json({ message: 'Invalid page number. Page must be 1 or greater.' });
		}
		const skip = (page - 1) * limit;

		const events = await Event.find().skip(skip).limit(limit);
		if (events.length === 0) {
			return res.status(200).json({ message: 'No events at the moment.' });
		}
		const totalEvents = await Event.countDocuments();
		return res.status(200).json({
			message: 'Events fetched successfully',
			data: events,
			pagination: {
				totalPage: Math.ceil(totalEvents / limit),
				total: totalEvents,
			},
		});
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: 'Error fetching events', error: error.message });
	}
};

const getUpcomingEvents = async (req, res) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		if (page < 1) {
			return res
				.status(400)
				.json({ message: 'Invalid page number. Page must be 1 or greater.' });
		}

		const skip = (page - 1) * limit;

		const upcomingEvents = await Event.find({
			startDate: { $gte: Date.now() },
		})
			.skip(skip)
			.limit(limit);

		if (upcomingEvents.length === 0) {
			return res
				.status(404)
				.json({ message: 'No upcoming events at the moment.' });
		}

		const totalUpcomingEvents = await Event.countDocuments({
			startDate: { $gte: Date.now() },
		});

		return res.status(200).json({
			message: 'Fetched Upcoming Events Successfully.',
			data: upcomingEvents,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalUpcomingEvents / limit),
				total: totalUpcomingEvents,
			},
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			message: 'An error occurred while fetching upcoming events.',
			error: error.message,
		});
	}
};

const getCompletedEvents = async (req, res) => {
	try {
		let page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		if (page < 1) {
			return res
				.status(400)
				.json({ message: 'Invalid page number. Page must be 1 or greater.' });
		}

		const skip = (page - 1) * limit;

		const completedEvents = await Event.find({
			startDate: { $lt: Date.now() },
		})
			.skip(skip)
			.limit(limit);

		if (completedEvents.length === 0) {
			return res
				.status(404)
				.json({ message: 'No completed events at the moment.' });
		}

		const totalCompletedEvents = await Event.countDocuments({
			startDate: { $lt: Date.now() },
		});

		return res.status(200).json({
			message: 'Fetched Upcoming Events Successfully.',
			data: completedEvents,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalCompletedEvents / limit),
				total: totalCompletedEvents,
			},
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			message: 'An error occurred while fetching upcoming events.',
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
};
