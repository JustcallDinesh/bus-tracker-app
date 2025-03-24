const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: String,
  busName: String,
  busRoute: String,
  busStops: String,
 
});
module.exports = mongoose.model("Bus", busSchema);
// busImage: Buffer,
// busImageType: String,