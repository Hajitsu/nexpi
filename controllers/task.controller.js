const { taskModel } = require('../models/task');

async function createTask(req, res, next) {
	try {
		const { title, text, category, user = req.user._id, status = 'pending' } = req.body;
		const result = await taskModel.create({
			title,
			text,
			category,
			user,
			status,
			expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 30,
		});
		if (!result) throw { status: 500, success: false, message: 'task not create.' };
		return res.status(200).json({
			status: 201,
			success: true,
			message: 'task created successfully',
		});
	} catch (error) {
		next(error);
	}
}

async function getTaskById(req, res, next) {
	try {
		const userId = req.user._id;
		const taskId = req.params.id;
		const task = await taskModel.findOne({ user: userId, _id: taskId });
		if (!taskId) throw { status: 400, message: 'task not found' };

		return res.status(200).json({
			status: 200,
			success: true,
			task: task,
		});
	} catch (error) {
		next(error);
	}
}

async function getAllTask(req, res, next) {
	try {
		const userId = req.user._id;
		const tasks = await taskModel.find({ user: userId }).sort({ _id: -1 });
		return res.status(200).json({
			status: 201,
			success: true,
			tasks: tasks,
		});
	} catch (error) {
		next(error);
	}
}

async function updateTask(req, res, next) {
	try {
	} catch (error) {
		next(error);
	}
}

async function deleteTask(req, res, next) {
	try {
		const { id: _id } = req.params;
		const userId = req.user._id;
		const task = await taskModel.findOne({ _id, userId });
		if (!task) throw { status: 404, message: 'task not found' };
		const result = await taskModel.deleteOne({ _id });
		if (result.deletedCount > 0)
			return res.status(201).json({
				status: 201,
				success: true,
				message: 'task delete successfully.',
			});
		throw { status: 403, message: 'task did not delete' };
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createTask,
	getTaskById,
	getAllTask,
	updateTask,
	deleteTask,
};
