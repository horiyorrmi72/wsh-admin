const bcrypt = require('bcryptjs');
const { authVariables } = require('../../configs/configVariables');
const jwt_secret = authVariables.jwt_secret;
const jwt = require('jsonwebtoken');

const salt = 12;

const hashData = function (data) {
	return bcrypt.hash(data, salt);
};

const compareData = async (plainData, hashedData) => {
	return await bcrypt.compare(plainData, hashedData);
};

const generateToken = async (payload, expiryPeriod) => {
	return jwt.sign(payload, jwt_secret, {
		expiresIn: expiryPeriod,
	});
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, jwt_secret);
	} catch (error) {
		return null;
	}
};

const extractToken = (req) => {
	const authHeader = req.headers.authorization;
	// console.log(authHeader);
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}
	return authHeader.split(' ')[1];
};

const isAdmin = async (req, res, next) => {
	try {
		const token = extractToken(req);
		if (!token) {
			return res.status(401).json({ message: 'Access Denied.' });
		}
		const decodedToken = verifyToken(token);
		if (!decodedToken) {
			return res.status(401).json({ message: 'Invalid token.' });
		}
		if (decodedToken.role !== 'admin')
		{
			console.log(decodedToken.role);
			return res.status(403).json({
				message: `You don't have the priviledge to access this page.`,
			});
		}
		req.user = decodedToken;
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message });
	}
};
const auth = async (req, res, next) => {
	try {
		const token = extractToken(req);
		if (!token) {
			return res.status(401).json({
				message: 'Access Denied',
			});
		}
		const decoded = verifyToken(token);
		if (!decoded) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		req.user = decoded;
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message });
	}
};
module.exports = {
	hashData,
	compareData,
	generateToken,
	verifyToken,
	isAdmin,
	auth,
};
