const path = require('path');
const { isValidObjectId } = require('mongoose');
const { userModel } = require('../models/user');
const { hashString } = require('../modules/utils');

async function createUser(req, res, next) {
	try {
		const { username, password, email, mobile } = req.body;

		const mobileRegex = /^09[0-9]{9}/;
		const emailRegex = /^[a-z]+[a-z0-9\_\.]{5,}\@[a-z]{2,10}\.[a-z]{2,8}/;
		if (!mobileRegex.test(mobile)) throw { status: 400, message: 'mobile format not currect.' };
		if (!emailRegex.test(email)) throw { status: 400, message: 'email format not currect.' };
		if (password.length < 5) throw { status: 400, message: 'password is too short.' };

		let user = await userModel.findOne({ username });
		if (user) throw { status: 400, message: 'username exist.' };

		user = await userModel.findOne({ email });
		if (user) throw { status: 400, message: 'email exist.' };

		user = await userModel.findOne({ mobile });
		if (user) throw { status: 400, message: 'mobile exist.' };

		const newUser = await userModel.create({ username, password: hashString(password), email, mobile });
		if (newUser) return res.json(newUser);
		throw { status: 500, message: "user didn't create." };
	} catch (error) {
		next(error);
	}
}

async function listOfUsers(req, res, next) {
	try {
		const users = await userModel
			.find({}, { _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0 })
			.sort({ _id: -1 });
		return res.json(users);
	} catch (error) {
		next(error);
	}
}

async function getUserById(req, res, next) {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) throw { status: 400, message: 'id is not valid' };

		const user = await userModel.findOne(
			{ _id: id },
			{ _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
		);
		if (!user) throw { status: 404, message: 'user not found' };
		console.log(req.protocol + req.get('host'));
		console.log(user.profileImage);
		user.profileImage = req.protocol + '://' + req.get('host') + user.profileImage.replace(/[\\\\]/gm, '/');
		return res.json(user);
	} catch (error) {
		next(error);
	}
}

async function deleteUserById(req, res, next) {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) throw { status: 400, message: 'id is not valid' };

		// const user = await userModel.findById(id);
		// if (!user) throw { status: 404, message: 'user not found' };
		// const result = await userModel.deleteOne({ _id: id });
		// if (result.deletedCount > 0)
		// 	return res.json({ status: 200, success: true, message: 'delete successfully.' });
		// throw { status: 404, message: 'user not deleted.' };

		const result = await userModel.findByIdAndDelete(id);
		if (result.deletedCount > 0)
			return res.json({ status: 200, success: true, message: 'delete successfully.' });
		throw { status: 404, message: 'user not deleted.' };
	} catch (error) {
		next(error);
	}
}

async function updateUser(req, res, next) {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) throw { status: 400, message: 'id is not valid' };

		const foundUser = await userModel.findById(id);
		if (!foundUser) throw { status: 404, message: 'user not found' };

		const { username, mobile, email } = req.body;
		let data = { ...req.body };

		const mobileRegex = /^09[0-9]{9}/;
		if (mobile && !mobileRegex.test(mobile)) {
			throw { status: 400, message: 'mobile format not currect.' };
		}

		const emailRegex = /^[a-z]+[a-z0-9\_\.]{5,}\@[a-z]{2,10}\.[a-z]{2,8}/;
		if (email && !emailRegex.test(email)) {
			throw { status: 400, message: 'email format not currect.' };
		}

		// let user;
		// if (username) {
		// 	user = await userModel.findOne({ username });
		// 	if (user) throw { status: 400, message: 'username exist.' };
		// }

		// if (email) {
		// 	user = await userModel.findOne({ email });
		// 	if (user) throw { status: 400, message: 'email exist.' };
		// }

		// if (mobile) {
		// 	user = await userModel.findOne({ mobile });
		// 	if (user) throw { status: 400, message: 'mobile exist.' };
		// }

		Object.entries(data).forEach(([key, value]) => {
			if (!value || ['', ' ', '.', null, undefined].includes(value) || value.length < 3) {
				delete data[key];
			}
			if (!['username', 'mobile', 'email'].includes(key)) {
				delete data[key];
			}
		});

		const result = await userModel.updateOne({ _id: id }, { ...data });
		if (result.modifiedCount > 0)
			return res.json({ status: 200, success: true, message: 'update successfully.' });
		throw { status: 404, message: 'user not updated.' };
	} catch (error) {
		next(error);
	}
}

async function uploadProfileImage(req, res, next) {
	const { id } = req.params;
	if (!isValidObjectId(id)) throw { status: 400, message: 'id is not valid' };

	const prefixPath = path.join(__dirname, '..');
	let image;
	if (req.file) {
		image = req.file.path.substring(prefixPath.length);
	} else {
		throw { status: 400, message: 'file is empty' };
	}
	const result = await userModel.updateOne({ _id: id }, { $set: { profileImage: image } });
	if (result.modifiedCount <= 0) throw { status: 400, successfull: false, message: 'update failed.' };
	console.log(req.file);
	return res.json({
		files: JSON.stringify(req.files),
	});
}

module.exports = {
	createUser,
	listOfUsers,
	getUserById,
	deleteUserById,
	updateUser,
	uploadProfileImage,
};
