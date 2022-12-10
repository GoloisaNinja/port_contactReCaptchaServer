import nodemailer from 'nodemailer';
import aws from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const mailMain = async ({ name, email, message }) => {
	const ses = new aws.SES({
		apiVersion: '2010-12-01',
		region: 'us-east-1',
		defaultProvider,
	});
	let transport = nodemailer.createTransport({
		SES: { ses, aws },
	});
	message = message + '\n\n' + `this message contact address was ${email}`;
	let mail = await transport.sendMail({
		from: 'admin@joncollins.dev',
		to: 'jonathan.collins@live.com',
		subject: `Dev contact from ${name}`,
		text: message,
	});
	console.log('Message sent: %s', mail.messageId);
};

export default mailMain;
