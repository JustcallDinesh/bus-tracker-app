// bus-tracker-admin-backend/models/bus.js
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busName: { type: String },
    busNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    model: { type: String },
    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route', // Reference to the Route model
    },
    busTypegvt: {
        type: String,
        enum: ['private', 'government'],
        default: 'private',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'adminUser', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;