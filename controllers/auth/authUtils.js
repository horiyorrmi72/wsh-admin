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

const generateToken = async (payload, expiryPeriod) =>{
	return jwt.sign(payload, jwt_secret, {
		expiresIn: expiryPeriod,
	});
};
module.exports = {
	hashData,
	compareData,
	generateToken,
};
