const router = require('express').Router();
const { getAllTask, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/task.controller');

router.get('/', getAllTask);
router.get('/:id', getTaskById);
router.post('/create', createTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

module.exports = router;
