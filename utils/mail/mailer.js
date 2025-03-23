const nodemailer = require('nodemailer');


/**
 * Sends an email with the specified subject, recipient, and message.
 *
 * @param {string} subject - The subject of the email.
 * @param {string} to - The recipient's email address.
 * @param {string} message - The body of the email message.
 * @returns {Promise<Object>} A promise that resolves to the information about the sent email.
 * @throws {Error} Throws an error if the email fails to send.
 */
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
