const express = require('express');
const {
    createApplication,
    getApplications,
    getApplicationStats,
    updateApplicationStatus,
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createApplication)
    .get(getApplications);

router.get('/stats', getApplicationStats);

router.patch('/:id/status', updateApplicationStatus);

module.exports = router;
