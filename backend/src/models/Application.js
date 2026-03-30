const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Reviewed', 'Approved', 'Rejected'],
        default: 'Draft',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    attachments: [{
        name: String,
        url: String,
        fileType: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    history: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        comment: String,
        changedAt: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true,
});

// Indexing for performance
applicationSchema.index({ status: 1 });
applicationSchema.index({ user: 1 });

module.exports = mongoose.model('Application', applicationSchema);
