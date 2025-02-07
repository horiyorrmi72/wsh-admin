const nodemailer = require('nodemailer');

class Email {
	constructor() {
		this.transporter = nodemailer.createTransport({});
	}

	async sendMail(subject, to, message) {
		try {
			const info = await this.transporter.sendMail({
				from: '',
				subject: subject,
				to: to,
				message,
			});
			return info;
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = Email;
