const spamEmails = ['ourperfectabode.com'];

export const spamEmailCheck = (email) => {
	const domain = email.split('@')[1];
	return spamEmails.includes(domain);
};
