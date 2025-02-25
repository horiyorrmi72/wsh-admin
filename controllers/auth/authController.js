const User = require('../../models/userModel');
const { hashData, compareData, generateToken } = require('./authUtils');
/**
 * signup
 * login
 * reset password
 *
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

		user.save();
		return res.status(201).json({ message: 'Successfully Registered!' });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message });
	}
};

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

		const myCookie = res.cookie('token', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
		// console.dir(`Cookie: ${token}`);
		return res.redirect('/dashboard');
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
