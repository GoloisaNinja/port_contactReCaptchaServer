import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import axios from 'axios';
// import nodemailer func
import mailMain from './nodeMail.js';
// creating the server
const app = express();
const corsOptions = {
	origin: [
		'http://localhost:8000',
		'https://joncollins.dev',
		'https://jcodes.page',
	],
	optionsSuccessStatus: 200,
	methods: 'POST',
};
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
// needed vars
const captchaSecret = process.env.RECAPTCHA_SECRET;
const captchaAPIBase = 'https://www.google.com/recaptcha/api/siteverify';
// define routes
app.post('/recaptcha', async (req, res) => {
	console.log(req.body);
	const token = await req.body.token;
	try {
		const response = await axios.post(
			`${captchaAPIBase}?secret=${captchaSecret}&response=${token}`
		);
		const resObj = {
			success: response.data.success,
			hostname: response.data.hostname,
		};
		if (resObj.success) {
			return res.status(200).send({ success: resObj.success });
		}
		return res.status(400).send({ success: false });
	} catch (error) {
		return res
			.status(500)
			.send({ error, message: 'Server issues...', success: false });
	}
});
app.post('/contact', async (req, res) => {
	const { name, email, subject, message } = req.body;
	try {
		if (subject === '') {
			await mailMain({ name, email, message });
			return res.status(200).send({ message: 'contact email sent...' });
		}
		res.status(200).send({ message: 'lol bots...' });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Server error...' });
	}
});

// create a port and listen for server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
