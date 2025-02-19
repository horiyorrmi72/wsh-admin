const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date },
		registrationUrl: { type: String, trim: true },
		state: {
			type: String,
			enum: ['upcoming', 'completed'],
			default: 'upcoming',
		},
		imagePath: { type: String, trim: true },
		assetPublicId: { type: String, trim: true },
	},
	{ timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
