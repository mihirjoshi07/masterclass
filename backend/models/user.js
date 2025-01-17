const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  latestToken: {
    type: String, // Store the latest token here
    default: ""
  },
  purchased_courses: [{
    type: mongoose.Schema.Types.ObjectId, // Reference to course IDs
    ref: 'Courses' // Reference to the 'Courses' collection
  }]
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
