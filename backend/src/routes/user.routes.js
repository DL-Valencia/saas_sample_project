const express = require('express');
const { getUsers, createUser, updateUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'SuperAdmin'), getUsers);
router.post('/', authorize('Admin', 'SuperAdmin'), createUser);
router.patch('/:id', authorize('SuperAdmin'), updateUser);

module.exports = router;
