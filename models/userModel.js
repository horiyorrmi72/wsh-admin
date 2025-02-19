const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true, min: 6 },
	role: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		enum: ['admin', 'user'],
		default: 'user',
	},
});
const User = mongoose.model('User', userSchema);
module.exports = User;
