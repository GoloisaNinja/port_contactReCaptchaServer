import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import axios from 'axios';
// creating the server
const app = express();
// middleware
app.use(express.json({ extended: false }));
// needed vars
const captchaSecret = process.env.RECAPTCHA_SECRET;
const captchaAPIBase = 'https://www.google.com/recaptcha/api/siteverify';
// define routes
app.post('/recaptcha', async (req, res) => {
	const token = req.body.token;
	try {
		const response = await axios.post(
			`${captchaAPIBase}?secret=${captchaSecret}&response=${token}`
		);
		const resObj = {
			success: response.data.success,
			hostname: response.data.hostname,
		};
		if (resObj.success && resObj.hostname === 'https://joncollins.dev') {
			return res.status(200).send({ success: resObj.success });
		}
		return res.status(400).send({ success: false });
	} catch (error) {
		return res
			.status(500)
			.send({ error, message: 'Server issues...', success: false });
	}
});

// create a port and listen for server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
