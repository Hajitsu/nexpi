const { userModel } = require('../models/user');
const { verifyToken } = require('../modules/utils');

async function autoLogin(req, res, next) {
	try {
		req.user = null;
		req.isLogin = false;

		const headers = req?.headers;
		if (!headers.authorization) throw { status: 401, message: 'login failed' };
		const token = headers.authorization.split(' ')[1];
		if (!token) throw { status: 401, message: 'login failed' };
		const payload = verifyToken(token);
		const user = await userModel.findOne({ username: payload.username });
		if (!user) throw { status: 401, message: 'login failed' };
		req.user = user;
		req.isLogin = true;
		next();
	} catch (error) {
		next(error);
	}
}

module.exports = {};
