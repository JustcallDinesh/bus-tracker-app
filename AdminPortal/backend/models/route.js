const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeName: {
        type: String,
        required: true,

    },
    trips: [
        {
            busRoute: [
                {
                    from: {
                        cityName: String,
                        departureTime: String,
                        latitude: Number,
                        longitude: Number,
                    },
                    to: {
                        cityName: String,
                        arrivalTime: String,
                        latitude: Number,
                        longitude: Number,
                    },
                },
            ],
            busStops: [
                {
                    name: { type: String, required: true },
                    latitude: { type: Number },
                    longitude: { type: Number },
                },
            ],
        },
    ],
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'adminUser', required: true },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
