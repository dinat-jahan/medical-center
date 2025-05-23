// cleanSessions.js
require("dotenv").config();
const mongoose = require("mongoose");

async function cleanOldSessions() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await mongoose.connection.db
    .collection("sessions")
    .deleteMany({ "session.user": { $exists: false } });

  console.log(`🧹 Deleted ${result.deletedCount} empty sessions`);
  await mongoose.disconnect();
}

cleanOldSessions();
