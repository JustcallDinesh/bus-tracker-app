// const Bus=require('./models/Bus');
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
require('dotenv').config();
// const busesRouter = require('../AdminPortal/backend/models/bus');
// const routesRouter = require('../AdminPortal/backend/models/route');

const app = express();
app.use(cors());
app.use(express.json());
const uri = process.env.MONGODB

// MongoDB connection (only attempt if URI is provided)
if (uri) {
  mongoose
    .connect(uri)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));
} else {
  console.warn('MONGODB environment variable is not set. Skipping MongoDB connection.');
}

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

//Old Bus Model
const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true },
  busType: [{ type: String }],
  amenities: [{ type: String }],
  isGovernt: { type: Boolean, default: true },
  // busTypegvt: {
  //   type: String,
  //   enum: ['private', 'government'],
  //   default: 'private',
  // },
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
  // busImageUri:{type:String},

  // registrationNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  model: { type: String },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // Reference to the Route model
  },
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'adminUser', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});
const Bus = mongoose.model('Bus', busSchema);

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,

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

// Add Bus Endpoint
app.post("/addBus", async (req, res) => {
  try {
    // console.log(req.body);

    const { busName, busNumber, busType, amenities, capacity, trips, isGovernt } = req.body;

    if (!trips || !Array.isArray(trips)) {
      return res.status(400).json({ message: "Invalid trips data: trips must be an array" });
    }

    for (const trip of trips) {
      const { busRoute, busStops } = trip;

      // Validation for busStops
      if (!busStops || !Array.isArray(busStops)) {
        return res.status(400).json({ message: "Invalid Bus Stops data" });
      }

      // Validate busType
      if (busType && !Array.isArray(busType)) {
        return res.status(400).json({ message: "Invalid Bus Type data: Must be an array" });
      }

      if (busType) {
        for (const type of busType) {
          if (typeof type !== 'string') {
            return res.status(400).json({ message: "Invalid Bus Type data: Array elements must be strings" });
          }
        }
      }

      if (amenities && !Array.isArray(amenities)) {
        return res.status(400).json({ message: "Invalid amenities data: Must be an array" });
      }

      if (amenities) {
        for (const type of amenities) {
          if (typeof type !== 'string') {
            return res.status(400).json({ message: "Invalid amenities data: Array elements must be strings" });
          }
        }
      }

      for (const segment of busRoute) {
        if (!segment.from || !segment.from.cityName || !segment.to || !segment.to.cityName) {
          return res.status(400).json({ message: "Invalid Bus Route data: Missing from/to city name" });
        }
        if (!segment.from || !segment.from.departureTime || !segment.to || !segment.to.arrivalTime) {
          return res.status(400).json({ message: "Invalid Bus Route data: Missing arrivalTime/departureTime city name" });
        }

        if (segment.from.latitude && (typeof segment.from.latitude !== 'number')) {
          return res.status(400).json({ message: "Invalid Bus Route data: Invalid 'from' latitude" });
        }
        if (segment.from.longitude && (typeof segment.from.longitude !== 'number')) {
          return res.status(400).json({ message: "Invalid Bus Route data: Invalid 'from' longitude" });
        }
        if (segment.to.latitude && (typeof segment.to.latitude !== 'number')) {
          return res.status(400).json({ message: "Invalid Bus Route data: Invalid 'to' latitude" });
        }
        if (segment.to.longitude && (typeof segment.to.longitude !== 'number')) {
          return res.status(400).json({ message: "Invalid Bus Route data: Invalid 'to' longitude" });
        }
      }

      for (const stop of busStops) {
        if (!stop.name) {
          return res.status(400).json({ message: "Invalid Bus Stop data : Missing Name" });
        }
        if ((stop.latitude && typeof stop.latitude !== 'number' || stop.longitude && typeof stop.longitude !== 'number')) {
          return res.status(400).json({ message: "Invalid Bus Stop data : Lat or Lon" });
        }
      }
    }

    const newBus = new Bus({
      busName,
      busNumber,
      busType,
      amenities,
      capacity,
      trips,
      isGovernt,
    });

    await newBus.save();
    res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (err) {
    console.error("Add Bus Error:", err);
    res.status(500).json({ message: "Failed to add bus", error: err.message });
  }
});

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const user = new User({ username, email, phone, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
});
// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, "7SHAyGU0kCEdj5Jm");
    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Profile endpoint (GET)
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    // console.log("Fetched user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username, email: user.email, phone: user.phone });
  } catch (err) {
    console.error("Profile GET Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Profile endpoint (PUT)
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, req.body);
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile PUT Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "k4IkpJ3VtOdaq5Q7", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// New Route Finder Endpoint
// app.get("/findRoutes", async (req, res) => {
//   try {
//     // console.log("called function");
//     const { from, to } = req.query;

//     let foundRoutes;

//     if (from && to) {
//       const trimmedFrom = from.trim().toLowerCase();
//       const trimmedTo = to.trim().toLowerCase();

//       // console.log(from, to);

//       foundRoutes = await Bus.find({
//         trips: {
//           $elemMatch: {
//             busRoute: {
//               $elemMatch: {
//                 "from.cityName": { $regex: new RegExp(trimmedFrom, "i") },
//                 "to.cityName": { $regex: new RegExp(trimmedTo, "i") },
//               },
//             },
//           },
//         },
//       });
//       // console.log("Founded Routes", foundRoutes);
//     } else {
//       foundRoutes = await Bus.find({});
//     }

//     res.json(foundRoutes);
//   } catch (err) {
//     console.error("Find Routes Error:", err);
//     res.status(500).json({ message: "Failed to find routes", error: err.message });
//   }
// });

app.get("/findRoutes", async (req, res) => {
  try {
    const { from, to } = req.query;
    let foundBuses = [];

    if (from && to) {
      const trimmedFrom = from.trim().toLowerCase();
      const trimmedTo = to.trim().toLowerCase();

      // 1. Search buses based on trips directly within the Bus model (existing logic)
      const busesWithOldStructure = await Bus.find({
        trips: {
          $elemMatch: {
            busRoute: {
              $elemMatch: {
                "from.cityName": { $regex: new RegExp(trimmedFrom, "i") },
                "to.cityName": { $regex: new RegExp(trimmedTo, "i") },
              },
            },
          },
        },
      });
      foundBuses.push(...busesWithOldStructure);

      // 2. Search buses based on assignedRoute and the trips within that Route
      const busesWithNewStructure = await Bus.find({
        assignedRoute: { $ne: null } // Only consider buses that have an assignedRoute
      }).populate({
        path: 'assignedRoute',
        match: {
          'trips.busRoute': {
            $elemMatch: {
              'from.cityName': { $regex: new RegExp(trimmedFrom, 'i') },
              'to.cityName': { $regex: new RegExp(trimmedTo, 'i') },
            },
          },
        },
      });

      // Filter out buses where the populated assignedRoute doesn't match the criteria
      const matchingNewBuses = busesWithNewStructure.filter(bus => bus.assignedRoute !== null);
      foundBuses.push(...matchingNewBuses);

    } else {
      // If no search terms, return all buses (populated with assignedRoute)
      const allBuses = await Bus.find().populate('assignedRoute');
      foundBuses = allBuses;
    }

    // Ensure unique buses in the result
    const uniqueBuses = Array.from(new Map(foundBuses.map(bus => [bus._id, bus])).values());

    res.json(uniqueBuses);

  } catch (error) {
    console.error("Find Routes Error:", error);
    res.status(500).json({ message: "Failed to find routes", error: error.message });
  }
});

// Modified Initial Data Endpoint (populating origin and destination)
app.get("/initialNewRoutes", async (req, res) => {
  try {
    // Use the `Bus` model (NewBus was not defined)
    const allBuses = await Bus.find().populate('assignedRoute');
    res.status(200).json(allBuses);
  } catch (error) {
    console.error("Error fetching initial new buses:", error);
    res.status(500).json({ message: "Failed to fetch initial bus data", error: error.message });
  }
});

//////////////////////////////////////////////
//7SHAyGU0kCEdj5Jm
/////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
