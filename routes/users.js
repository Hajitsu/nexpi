const router = require('express').Router();
const {
	createUser,
	listOfUsers,
	getUserById,
	deleteUserById,
	updateUser,
	uploadProfileImage,
} = require('../controllers/user.conteroller');
const { autoLogin } = require('../middlewares/checkLogin');
const { upload } = require('../modules/utils');

router.post('/create', createUser);
router.post('/create', createUser);
router.get('/', listOfUsers);
router.get('/profile', (req, res, next) => {
	return res.json({ user: req.user });
});
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.patch('/:id', updateUser);
router.put('/profile/:id', upload.single('image'), uploadProfileImage);

module.exports = router;
