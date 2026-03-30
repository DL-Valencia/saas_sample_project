const Application = require('../models/Application');
const User = require('../models/User');
const { createLog } = require('../services/log.service');
const { createNotification } = require('../services/notification.service');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
    const { title, description, metadata } = req.body;

    const application = await Application.create({
        title,
        description,
        user: req.user._id,
        metadata,
        history: [{
            status: 'Draft',
            changedBy: req.user._id,
            comment: 'Application created as draft',
        }]
    });

    await createLog({
        user: req.user._id,
        action: 'CREATE',
        entity: 'Application',
        entityId: application._id,
        details: `Created application: ${title}`,
        req
    });

    res.status(201).json(application);
};

// @desc    Get all applications (with pagination and filtering)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // RBAC: Users only see their own, Admin/SuperAdmin see all
    if (req.user.role === 'User') {
        query.user = req.user._id;
    }

    if (status) {
        query.status = status;
    }

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
        Application.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Application.countDocuments(query)
    ]);

    res.json({
        applications,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
};

// @desc    Get counts for dashboard KPIs
// @route   GET /api/applications/stats
// @access  Private
const getApplicationStats = async (req, res) => {
    const query = req.user.role === 'User' ? { user: req.user._id } : {};

    const stats = await Application.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const formattedStats = {
        Draft: 0,
        Submitted: 0,
        Reviewed: 0,
        Approved: 0,
        Rejected: 0
    };

    stats.forEach(s => {
        formattedStats[s._id] = s.count;
    });

    res.json(formattedStats);
};

// @desc    Update application status (Workflow transition)
// @route   PATCH /api/applications/:id/status
// @access  Private (Restricted based on role)
const updateApplicationStatus = async (req, res) => {
    const { status, comment } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    // Role-based transition logic
    // Users can only submit drafts
    if (req.user.role === 'User' && status !== 'Submitted') {
        return res.status(403).json({ message: 'Users can only submit applications' });
    }

    // Admins/SuperAdmins can transition to Reviewed, Approved, or Rejected
    if (['Admin', 'SuperAdmin'].includes(req.user.role)) {
        if (!['Reviewed', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status transition for Admin' });
        }
    }

    const oldStatus = application.status;
    application.status = status;
    application.history.push({
        status,
        changedBy: req.user._id,
        comment: comment || `Status updated from ${oldStatus} to ${status}`,
    });

    await application.save();

    // Log the action
    await createLog({
        user: req.user._id,
        action: 'UPDATE_STATUS',
        entity: 'Application',
        entityId: application._id,
        details: `Status changed from ${oldStatus} to ${status}`,
        req
    });

    // Notify the owner if status changed by someone else
    if (application.user.toString() !== req.user._id.toString()) {
        await createNotification({
            recipient: application.user,
            sender: req.user._id,
            title: 'Application Status Updated',
            message: `Your application "${application.title}" has been ${status.toLowerCase()}.`,
            type: status === 'Approved' ? 'Success' : (status === 'Rejected' ? 'Error' : 'Info'),
            link: `/applications/${application._id}`
        });
    }

    res.json(application);
};

module.exports = {
    createApplication,
    getApplications,
    getApplicationStats,
    updateApplicationStatus,
};
