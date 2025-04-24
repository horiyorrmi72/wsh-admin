const nodemailer = require('nodemailer');
const { mailer } = require('../../configs/configVariables');

const hostName = mailer.emailSmtpHost || "smtpout.secureserver.net";
const mailPort = mailer.emailPort || 465;
const mailSecure = mailPort === 465;
const userEmail = mailer.userEmail;
const userPassword = mailer.userPassword;

class Email {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: hostName,
			port: mailPort,
			secure: mailSecure,
			auth: {
				user: userEmail,
				pass: userPassword
			}
		});
	}

	async sendMail(to, subject, message, from = userEmail) {
		try
		{
			const info = await this.transporter.sendMail({
				from,
				to,
				subject,
				text: message,
				html: `<p>${message}</p>`
			});
			return info;
		} catch (err)
		{
			console.error("Email sending error:", err);
			throw new Error("Failed to send email.");
		}
	}

	async contactFormMail(data) {
		const { email, subject, message, name } = data;
		if (!email || !message)
		{
			throw new Error("Email and message are required!");
		}
		const to = "info@womensafehouse.org";
		await this.sendMail(to, subject || "New Contact Form Mail", message, email);
	}
}

module.exports = Email;
