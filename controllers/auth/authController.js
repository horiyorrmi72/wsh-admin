const User = require('../../models/userModel');
const { hashData, compareData, generateToken } = require('./authUtils');
/**
 * signup
 * login
 * reset password
 *
 */

/**
 * Handles user signup by validating input, checking for existing users,
 * hashing the password, and saving the new user to the database.
 *
 * @async
 * @function signup
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with a status code and message.
 *
 * @throws {Error} If an internal server error occurs.
 */
const signup = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}
	if (password.length < 6) {
		return res
			.status(400)
			.json({ message: 'password must be at least 6 characters long' });
	}
	try {
		const existingUser = await User.findOne({ email: email }).exec();
		if (existingUser) {
			return res
				.status(409)
				.json({ message: 'User already exist, kindly log in' });
		}
		const hashpassword = await hashData(password);

		const user = new User({
			name,
			email,
			password: hashpassword,
		});

		await user.save();
		return res.status(201).json({ message: 'Successfully Registered!' });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message });
	}
};

/**
 * Handles user sign-in by validating credentials and generating a JWT token.
 *
 * @async
 * @function signin
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user credentials.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response with a success message and token on successful login,
 * or an error message on failure.
 *
 * @throws {Error} Returns a 500 status code with an error message if an internal server error occurs.
 */
const signin = async (req, res) => {
	const { email, password } = req.body;
	// console.log('Received request body:', req.body);

	if (!email || !password) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	try {
		const user = await User.findOne({ email: email }).exec();
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Invalid user details, kindly register' });
		}

		const verifyPassword = await compareData(password, user.password);
		if (!verifyPassword) {
			return res.status(401).json({ message: 'Invalid password' });
		}

		const expiryPeriod = '3h';
		const token = await generateToken(
			{ id: user._id, role: user.role },
			expiryPeriod
		);

	
		res.status(200).json({
			message: 'Login successful',
			token,
		});
	} catch (error) {
		console.error('Error during login:', error.message);
		return res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message });
	}
};

module.exports = {
	signup,
	signin,
};
