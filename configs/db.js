const mongoose = require('mongoose');
const { db_variables } = require('./configVariables');
const URL = db_variables.dbUrl;

const connectDb = async () => {
	try {
		await mongoose.connect(URL, {
			dbName: 'wsh',
		});
		console.log('Connected to the database successfully!');
	} catch (err) {
		console.error(`Error connecting to the database: ${err}`);
		process.exit(1);
	}
};

module.exports = connectDb;
