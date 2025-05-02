// bus-tracker-admin-backend/models/schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
    },
    departureTimes: [{
        type: String, // Store as "HH:mm" format
        required: true,
    }],
    daysOfWeek: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    }],
    // Optional:
    arrivalTimes: [{ type: String }], // If you want to define arrival times
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    startDate: { type: Date },
    endDate: { type: Date },
    notes: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'adminUser', required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
