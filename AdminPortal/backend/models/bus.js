// bus-tracker-admin-backend/models/bus.js
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    registrationNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    busName: { type: String },
    model: { type: String },
    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route', // Reference to the Route model
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;