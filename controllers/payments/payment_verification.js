const flutterwave = require('flutterwave-node-v3');
const crypto = require("crypto");
const { default: axios } = require('axios');
const { publicKey, secretKey, redirect, } =
	require('../../configs/configVariables').flwConfigs;
// console.log("secretKey:", secretKey);
const flw = new flutterwave(publicKey, secretKey);


const paymentWebhook = async (req, res) => {
	try
	{
		const signature = req.headers["verif-hash"];
		const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET

		const hash = crypto.createHash("sha256").update(webhookSecret).digest("hex");
		if (!signature || signature !== hash)
		{
			console.warn("Unauthorized webhook access detected.");
			return res.status(403).json({ message: "Invalid signature" });
		}

		const event = req.body;
		console.log("Flutterwave Webhook Received:", event);

		//successful payments
		if (event.event === "charge.completed" && event.data.status === "successful")
		{
			const transactionId = event.data.id;
			const txRef = event.data.tx_ref;

			// verify the payment
			const verified = await flw.Transaction.verify({ id: transactionId });

			if (verified.status === "success" && verified.data.status === "successful")
			{
				console.log(`Payment verified: ${txRef}`);
				return res.status(200).json({ success: true, message: "Payment verified" });
			}
		}

		//response for failed transactions
		return res.status(200).json({ success: false, message: "Payment not successful" });
	} catch (error)
	{
		console.error("Webhook Error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};


const initiatePayments = async (req, res) => {

	const { email, amount, size, clothType, productQuantity } = req.body;
	const now = Date.now();
	const tx_ref = `Tshirt_${clothType}-${now}`;
	const redirectLink = redirect;
	console.log(redirectLink);
	try
	{
		const response = await axios.post(
			'https://api.flutterwave.com/v3/payments',
			{
				tx_ref,
				amount,
				currency: 'NGN',
				redirect_url: redirect,
				customer: {
					email: email,
					name: email,
					size,
					clothType,
					productQuantity
				},
				customizations: {
					title: 'horla_techs',
				},
			},
			{
				headers: {
					Authorization: `Bearer ${secretKey}`,
					'Content-Type': 'application/json',
				},
			}
		);
		const { status, data: { link } = {} } = response.data;
		return res.status(200).json({ data: { status, link } });

	} catch (err)
	{
		console.error(err.code);
		console.error(err?.response?.data);
	}
};



const verifyPayment = async (id) => {
	try
	{
		const response = await flw.Transaction.verify({ id });

		if (!response || response.status !== "success")
		{
			throw new Error("No response from payment gateway.");
		}

		return response.data;
	} catch (error)
	{
		console.error("Flutterwave Verification Error:", error?.response?.data || error.message);
		throw new Error(error?.response?.data?.message || "Payment Verification Failed.");
	}
};



const verify = async (req, res) => {
	const { data } = req.body;


	try
	{
		if (!data?.id)
		{
			return res.status(400).json({ message: "Invalid request!🚨" });
		}
		const transactionId = data.id;
		const verified = await verifyPayment(transactionId);
		const transaction = verified?.data || verified;

		if (transaction?.status === "success")
		{
			return res.status(200).json({
				message: "Payment Successful.",
				transactionId: transaction?.id,
				amount: transaction?.amount,
				currency: transaction?.currency,
				customer: transaction?.customer?.email,
			});
		}

		return res.status(409).json({message: `Payment ${transaction?.status || "failed"}.`,transactionId: transaction?.id});
	} catch (error)
	{
		const errorMessage = error?.message || "Payment Verification Failed.";

		if (errorMessage.includes("Transaction does not exist") || error?.statusCode === 400)
		{
			return res.status(400).json({ message: "Invalid Transaction ID" });
		}

		console.error("Verification Error:", error);
		return res.status(500).json({
			message: "Internal Server Error, please try later.",
			error: errorMessage,
		});
	}
};


module.exports = {
	initiatePayments,
	verify,
	paymentWebhook
};
