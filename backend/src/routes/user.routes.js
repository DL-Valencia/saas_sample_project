const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'SuperAdmin'), getUsers);
router.post('/', authorize('Admin', 'SuperAdmin'), createUser);
router.patch('/:id', authorize('SuperAdmin'), updateUser);
router.delete('/:id', authorize('SuperAdmin'), deleteUser);

module.exports = router;
