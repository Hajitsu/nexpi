const router = require('express').Router();
const authRoutes = require('./authentication');
const userRoutes = require('./users');
const taskRoutes = require('./tasks');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
