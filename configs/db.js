const mongoose = require('mongoose');
const { db_variables } = require('./configVariables');
const { hashData } = require('../controllers/auth/authUtils');
const User = require('../models/userModel');

const URL = db_variables.dbUrl;
const adminEmail = db_variables.adminEmail;
const adminPassword = db_variables.password;

const adminData = {
	name: 'Admin',
	email: adminEmail,
	password: adminPassword,
	role: 'admin',
};

const connectDb = async () => {
	try {
		await mongoose.connect(URL, {
			dbName: 'wsh',
		});
		console.log('✅ Connected to the database successfully!');

	
		await seedAdmin();
	} catch (err) {
		console.error(`❌ Error connecting to the database: ${err.message}`);
		process.exit(1);
	}
};

// Seeding function to create admin if admin doesn't exist on the db
const seedAdmin = async () => {
	try {
		const existingAdmin = await User.findOne({ role: 'admin' });
		if (existingAdmin) {
			// console.log(' Admin user already exists.');
			return;
		}

		// Hashing the password before saving
		const hashedPassword = await hashData(adminData.password);
		adminData.password = hashedPassword;

		// Creating the admin user
		await User.create(adminData);
		console.log(' Admin user created successfully!');
	} catch (error) {
		console.error('❌ Error seeding admin:', error.message);
	}
};

module.exports = connectDb;
