const bcrypt = require('bcrypt');
const cryptojs = require('crypto-js');

const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {

	const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CLE_EMAIL}`).toString();

	bcrypt.hash(req.body.password, 10)
	.then(hash => {
		const user = new User({
			email: emailCryptoJs,
			password: hash,
		});
		user.save()
			.then(() => res.status(201).json({message: 'user created !'}))
			.catch(error => res.status(400).json({error: 'this email is not correct'}));
	})
	.catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
	const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CLE_EMAIL}`).toString();
	User.findOne({email: emailCryptoJs})
		.then(user => {
			if (!user) {
				return res.status(401).json({error: 'user not found !'});
			}
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) {
						return res.status(401).json({error: 'wrong password !'});
					}
						res.status(200).json({
							userId: user._id,
							token: jwt.sign(
								{userId: user._id},
								'RANDOM_TOKEN_SECRET',
								{expiresIn: '24h'}
							)
						});
				})
				.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};