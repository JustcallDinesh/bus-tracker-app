// const Bus=require('./models/Bus');
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const { types } = require("@babel/core");
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://dinesh7091566641:k4IkpJ3VtOdaq5Q7@cluster0.tkhff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Bus Model
const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  busNumber: { type: String, required: true },
  busType: [{ type: String }],
  amenities: [{ type: String }],
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
      latitude: { type: Number }, // Added latitude
      longitude: { type: Number }, // Added longitude
    },
  ],
  isGovernt: { type: Boolean, default: true },
  // busImageUri:{type:String},
});

const Bus = mongoose.model("Bus", busSchema);

// Add Bus Endpoint
app.post("/addBus", async (req, res) => {
  try {
    const { busName, busNumber, busType, amenities, busRoute, busStops, isGovernt } = req.body;
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

      // Validate latitude and longitude only if they exist
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
      if (!stop.name) { // Updated validation
        return res.status(400).json({ message: "Invalid Bus Stop data : Missing Name" });
      }
      if ((stop.latitude && typeof stop.latitude !== 'number' || stop.longitude && typeof stop.longitude !== 'number')) {
        return res.status(400).json({ message: "Invalid Bus Stop data : Lat or Lon" });
      }
    }
    // ... (other validation)
    const newBus = new Bus({
      busName,
      busNumber,
      busType,
      amenities,
      busRoute,
      busStops,
      isGovernt,
      // busImageUri,
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
// AIzaSyC2w9WiuqlFqCpEsfGsQ79Ybap1TE4szJI
// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, "k4IkpJ3VtOdaq5Q7");
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
app.get("/findRoutes", async (req, res) => {
  try {
    const { from, to } = req.query;

    let foundRoutes;

    if (from && to) {
      const trimmedFrom = from.trim().toLowerCase();
      const trimmedTo = to.trim().toLowerCase();

      foundRoutes = await Bus.find({
        "busRoute.0.from.cityName": { $regex: new RegExp(trimmedFrom, "i") }, // Removed extra space
        "busRoute.0.to.cityName": { $regex: new RegExp(trimmedTo, "i") }, // Removed extra space
      });
    } else {
      foundRoutes = await Bus.find({});
    }


    res.json(foundRoutes);
  } catch (err) {
    console.error("Find Routes Error:", err);
    res.status(500).json({ message: "Failed to find routes", error: err.message });
  }
});

//////////////////////////////////////////////

/////////////////////////////////////////////

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
