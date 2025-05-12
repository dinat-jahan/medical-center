const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// Import the TimeSlot model
const TimeSlot = require("../api/models/timeslot"); // Adjust the path as per your project structure

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Delete all time slots from the TimeSlot collection
    TimeSlot.deleteMany({})
      .then(() => {
        console.log("All time slots deleted successfully.");
        mongoose.connection.close(); // Close the connection after operation
      })
      .catch((err) => {
        console.error("Error deleting time slots:", err);
        mongoose.connection.close();
      });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
