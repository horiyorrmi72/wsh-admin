require('dotenv').config();
module.exports = {
	server_env_variables: {
		port: process.env.PORT,
	},
	db_variables: {
		dbUrl: process.env.DB_URL,
	},
	authVariables: {
		jwt_secret: process.env.JWT_SECRET,
	},
	flwConfigs: {
		publicKey: process.env.FLW_PUBLIC_KEY,
		secretKey: process.env.FLW_SECRET_KEY,
		encrypt: process.env.FLW_ENCRYPTION_KEY,
		redirect: process.env.FLW_REDIRECT_URL
	},
};
