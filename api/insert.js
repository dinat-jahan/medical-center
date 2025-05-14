const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// Import the TimeSlot model
const Medicine = require("../api/models/medicine"); // Adjust the path as per your project structure

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Delete all time slots from the TimeSlot collection
    Medicine.deleteMany({})
      .then(() => {
        console.log("All Medicine deleted successfully.");
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
