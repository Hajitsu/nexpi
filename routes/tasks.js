const router = require('express').Router();
const { getAllTask, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { autoLogin } = require('../middlewares/checkLogin');

router.get('/', autoLogin, getAllTask);
router.get('/:id', autoLogin, getTaskById);
router.post('/create', autoLogin, createTask);
router.put('/:id', autoLogin, updateTask);
router.delete('/delete/:id', autoLogin, deleteTask);

module.exports = router;
