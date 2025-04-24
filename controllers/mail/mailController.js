const Email = require('../../utils/mail/mailer');


const emailService = new Email();


const receiveMail = async (req, res) => {
    try
    {
        const { name, email, subject, message } = req.body;

        if (!email || !message)
        {
            return res.status(400).json({ error: 'Email and message are required.' });
        }

        await emailService.contactFormMail({ email, name, subject, message, });

        return res.status(200).json({ success: true, message: 'Contact form email sent successfully.' });
    } catch (error)
    {
        return res.status(500).json({ error: 'Failed to send email.', details: error.message });
    }
}

module.exports = {
    receiveMail
}