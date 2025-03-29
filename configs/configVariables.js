require('dotenv').config();
module.exports = {
	server_env_variables: {
		port: process.env.PORT,
	},
	db_variables: {
		dbUrl: process.env.DB_URL,
		adminEmail: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD,
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
	mailer: {
		emailSmtpHost: process.env.MAILER_HOST,
		emailPort: process.env.MAILER_PORT,
		secure: process.env.MAIL_SECURE_PORT,
		userEmail: process.env.MAILER_EMAIL,
		userPassword:process.env.MAILER_EMAIL_PASSWORD
	}

};
