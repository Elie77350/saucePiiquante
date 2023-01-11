const passwordValidator = require('password-validator');

let passwordSchema = new passwordValidator();

passwordSchema
	.is().min(4)
	.is().max(10)
	.has().uppercase()
	.has().lowercase()
	.has().digits(2)
	.has().not().spaces()
	.is().not().oneOf(['Passw0rd', 'Password123', 'Azerty1', 'Azert2']);

module.exports = (req, res, next) => {
	if (passwordSchema.validate(req.body.password)) {
		next();
	} else {
		res.status(400).json({message: 'The password must be stronger:'+ passwordSchema.validate('req.body.password', { list: true })});
	}
};