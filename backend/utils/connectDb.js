// db.js
require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,       // Use the new MongoDB connection string parser
  useUnifiedTopology: true,    // Use the new server discovery and monitoring engine
})
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose; // Export mongoose for use in other files
