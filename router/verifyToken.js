const jwt = require('jsonwebtoken');
const User = require('../model/user');

module.exports = async (req, res, next) => {
	const token = req.cookies.jsonwebtoken;

	if (token) {
		const userObject = jwt.verify(token, 'secretKey');
		const user = await User.findOne({
			email: userObject.user.email
		});
		req.body.user = user;
		next();
	} else {
		next();
	}
};
