// Import required modules
const express = require('express');
const cors = require('cors');
require("dotenv").config();
require("./utils/connectDb")
const cookie_parser=require("cookie-parser");
// Create an instance of the express app
const app = express();

// Middleware
// Update your CORS middleware to allow credentials
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your React app's URL if it's different
  methods: ['GET', 'POST'],
  credentials: true, // This allows cookies (if you're using them)
}));
app.use(express.json());  // Parse incoming JSON requests
app.use(express.urlencoded({extended:true}));
app.use(cookie_parser())

//import routes
const authRoute=require("./routes/authRoute");
const courseRoute=require("./routes/courseRoute");


//configure routes
app.use("/auth",authRoute);
app.use("/course",courseRoute);

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server on port 4000
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
