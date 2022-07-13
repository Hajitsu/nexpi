const { userModel } = require('../models/user');
const { hashString, compareDatWithHash, jwtGenerator } = require('../modules/utils');

async function register(req, res, next) {
	try {
		const { username, password, confirmPassword, email, mobile } = req.body;

		const mobileRegex = /^09[0-9]{9}/;
		const emailRegex = /^[a-z]+[a-z0-9\_\.]{5,}\@[a-z]{2,10}\.[a-z]{2,8}/;
		if (!mobileRegex.test(mobile)) throw { status: 400, message: 'mobile format not currect.' };
		if (!emailRegex.test(email)) throw { status: 400, message: 'email format not currect.' };
		if (password.length < 5) throw { status: 400, message: 'password is too short.' };
		if (password !== confirmPassword) throw { status: 400, message: 'confirm password is wrong' };

		let user = await userModel.findOne({ username });
		if (user) throw { status: 400, successfull: false, message: 'username exist' };
		user = await userModel.findOne({ email });
		if (user) throw { status: 400, successfull: false, message: 'email exist' };
		user = await userModel.findOne({ mobile });
		if (user) throw { status: 400, successfull: false, message: 'mobile exist' };

		await userModel.create({ username, password: hashString(password), email, mobile }).catch((error) => {
			throw { status: 500, message: "user didn't create." + error };
		});
		return res.json({ status: 201, successfull: true, message: 'user create successfully.' });
	} catch (error) {
		next(error);
	}
}

async function login(req, res, next) {
	try {
		const { username, password } = req.body;
		let user = await userModel.findOne({ username });
		if (!user) throw { status: 401, message: 'username/password is wrong' };
		if (compareDatWithHash(password, user.password))
			throw { status: 401, message: 'username/password is wrong' };
		user.token = jwtGenerator(user);
		user.save();
		return res
			.status(200)
			.json({ status: 200, success: true, message: 'login successfully.', token: user.token });
	} catch (error) {
		next(error);
	}
}

async function resetPassword(req, res, next) {
	try {
	} catch (error) {
		next(error);
	}
}

module.exports = {
	register,
	login,
	resetPassword,
};
