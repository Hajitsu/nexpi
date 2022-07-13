const router = require('express').Router();
const authRoutes = require('./authentication');
const userRoutes = require('./users');
const taskRoutes = require('./tasks');
const { autoLogin } = require('../middlewares/checkLogin');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', autoLogin, taskRoutes);

module.exports = router;
