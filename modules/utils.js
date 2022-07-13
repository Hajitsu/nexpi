const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { SECRET_KEY, EXPIRE_IN } = require('../configs/constants');

function hashString(data) {
	const salt = bcrypt.genSaltSync(10);
	const hashed = bcrypt.hashSync(data, salt);
	return hashed;
}
function compareDatWithHash(data, hashedString) {
	return bcrypt.compareSync(data, hashedString);
}

function jwtGenerator(payload, day = 7) {
	const { username, mobile, email } = payload;
	return jwt.sign({ username, mobile, email }, SECRET_KEY, { expiresIn: EXPIRE_IN });
}

function verifyToken(token) {
	try {
		const result = jwt.verify(token, SECRET_KEY);
		console.log(`🥷🏻✶ | file: utils.js | line 24 | verifyToken | result`, result);
		if (!result?.username) {
			throw { status: 401, message: 'login failed.' };
		}
		return result;
	} catch (error) {
		console.log(`🥷🏻✶ | file: utils.js | line 28 | verifyToken | error`, error);
		throw { status: 401, message: 'login failed => ' + error };
	}
}

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const year = new Date().getFullYear();
		const month = new Date().getMonth();
		const day = new Date().getDay();
		const uploadPath = `${__dirname}/../public/uploads/images/${year}/${month}/${day}`;
		require('fs').mkdirSync(uploadPath, { recursive: true });
		callback(null, uploadPath);
	},
	filename: (req, file, callback) => {
		const ext = path.extname(file.originalname).toLowerCase();
		callback(null, String(Date.now()) + ext);
	},
});
const upload = multer({ storage });

module.exports = {
	hashString,
	compareDatWithHash,
	upload,
	jwtGenerator,
	verifyToken,
};
