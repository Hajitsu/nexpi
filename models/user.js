const { Schema, model } = require('mongoose');
const userSchema = new Schema(
	{
		firstName: { type: String },
		lastName: { type: String },
		username: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true },
		mobile: { type: String },
		profileImage: { type: String, default: 'default.jpg' },
		age: { type: Number },
		token: { type: String, default: 'HAJITSU' },
		role: { type: String, default: 'USER', required: true },
	},
	{
		timestamps: true,
	}
);

const userModel = model('user', userSchema);
module.exports = { userModel };
