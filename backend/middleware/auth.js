const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        console.log("Hit middleware")
        if (!token) return res.status(401).json({ message: "Unauthorized: No token provided." });
        console.log("client token  : ",token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        const user = await userModel.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User not found." });
       
        // Check if the token matches the latest token stored in the database
        if (token !== user.latestToken) {
            return res.status(403).json({ message: ": Invalid or expired token." });
        }
        const userData=await userModel.findOne({_id:decoded.id},{_id:1,email:1,purchased_courses:1})
        req.user =userData ;
        console.log("Pass to the next function ")
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid or expired token." });
    }
};

module.exports = authMiddleware;
