const { Schema, model, Types } = require('mongoose');

const taskSchema = new Schema(
	{
		title: { type: String, required: true },
		text: { type: String, required: true },
		image: { type: String, default: undefined },
		user: { type: Types.ObjectId, required: true },
		status: { type: String, default: 'pending' },
		category: { type: String, default: 'work' },
		expresIn: { type: Date, default: new Date() },
	},
	{ timestamps: true }
);

const taskModel = model('task', taskSchema);
module.exports = {
	taskModel,
};
