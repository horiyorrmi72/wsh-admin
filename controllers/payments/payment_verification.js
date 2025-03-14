const flutterwave = require('flutterwave-node-v3');
const { publicKey, secretKey, encrypt } =
	require('../../configs/configVariables').flwConfigs;
const flw = new flutterwave(publicKey, secretKey);


const verifyPayment = async (id) => {
	// let id = data.id;
	try {
		const response = await flw.Transaction.verify({ id });
		if (!response) {
			throw new Error('No response from payment gateway.');
		}
		return response.data;
	} catch (error) {
		console.error(
			'Flutterwave Verification Error:',
			error?.response?.data || error.message
		);
		throw new Error(
			error?.response?.data?.message || 'Payment Verification Failed.'
		);
	}
};

const verify = async (req, res) => {
	const { data } = req.body;
	if (!data || !data.id) {
		return res.status(400).json({ message: 'Invalid request!🚨' });
	}
	try {
        let transactionId = data.id;
        // console.log(transactionId);
        const verified = await verifyPayment(transactionId);
        console.log(verified);

        const transaction = verified?.data || verified;
        console.log(transaction)
		// if (!verified) {
		// 	return res.status(500).json({
		// 		message: 'No response from payment gateway. Please try again later.',
		// 	});
		// }
		if (transaction?.status === 'success') {
			return res
				.status(200)
				.json({ message: 'Payment Successful.', transaction });
		}
		return res.status(400).json({message: `Payment ${transaction?.status || 'failed'}.`,transaction});
	} catch (error) {
		console.log(error);
		if (
			error?.message.includes('Transaction does not exist') ||
			error?.statusCode === 400
		) {
			return res.status(400).json({ message: 'Invalid Transaction ID' });
		}
		return res.status(500).json({
			message: 'Internal Server Error, please try later.',
			error: error.message || 'Unknown Error.',
		});
	}
};

module.exports = {
	verify,
};
