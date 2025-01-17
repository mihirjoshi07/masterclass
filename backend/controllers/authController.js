const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { oauth2client } = require("../utils/googleAuth")
exports.signUp = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log("Email : ", email);

        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ email, password: hashedPassword });

        const token = jwt.sign(
            { id: newUser._id, timestamp: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );

        // Save the token in the database
        newUser.latestToken = token;
        await newUser.save();

        newUser.password = undefined;
        newUser.latestToken = undefined;
        console.log(newUser)

        res.cookie("token", token, {
            httpOnly: true,           // Prevents client-side scripts from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
            sameSite: "Strict",       // Adjust as needed for your use case
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        });
        res.status(201).json({ message: "User signed up successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials." });

        const token = jwt.sign(
            { id: user._id, timestamp: Date.now() },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );

        // Update the latestToken in the database
        user.latestToken = token;
        await user.save();
        user.password = undefined;
        user.latestToken = undefined;
        res.cookie("token", token, {
            httpOnly: true,           // Prevents client-side scripts from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
            sameSite: "Strict",       // Adjust as needed for your use case
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        });
        res.status(200).json({ message: "Login successful.", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error." });
    }
};

exports.loginWithGoogle = async (req, res) => {
    try {
        const { code } = req.query;
        console.log("code : ", code)
        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
        )

        const { email } = userRes.data;
        let user = await userModel.findOne({ email: email });

        if (!user) {
            user = await userModel.create({
                email
            })
        }
        const { _id } = user;
        const token = jwt.sign({ id: _id, timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: "10d" })
        user.latestToken = token;
        await user.save();

        user.latestToken = undefined;

        console.log(user);
        console.log(token)

        res.cookie("token", token, {
            httpOnly: true,           // Prevents client-side scripts from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
            sameSite: "Strict",       // Adjust as needed for your use case
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        });

        return res.status(200).json({
            message: "Success",
            user,
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


exports.logout = (req, res) => {
    // Clear the token cookie by setting it to an empty value and immediate expiration
    res.cookie('token', '', { httpOnly: true, secure: process.env.NODE_ENV === "production", expires: new Date(0) });
    return res.status(200).json({ message: 'Logged out successfully.' });
}