// courseController.js
const mongoose = require('../utils/connectDb');  // Import the MongoDB connection (db.js)
const userModel = require("../models/user");
const courseModel = require("../models/courseSchema");
const { response } = require('express');
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.listAllCourses = async (req, res) => {
    try {
        const user = req.user; // Get the user from the request object
        const purchasedCourses = user.purchased_courses.map(String); // Convert purchased course IDs to strings for comparison

        // Check database connection
        if (!mongoose.connection.readyState)
            return res.status(500).json({ error: 'Database connection error' });

        // Fetch all courses
        const courses = await courseModel.find({}, { videos: 0, detailed_description: 0 });

        // Handle empty courses
        if (!courses.length)
            return res.status(404).json({ message: 'No courses available' });

        // Map through courses and add isPurchased flag
        const updatedCourses = courses.map(course => ({
            ...course._doc, // Spread the course data
            isPurchased: purchasedCourses.includes(String(course._id)), // Check if the course is purchased
        }));

        res.status(200).json(updatedCourses); // Send the updated courses with isPurchased flag
    } catch (err) {
        console.error('Error fetching courses:', err.message || err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSingleCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const courseId = new mongoose.Types.ObjectId(id);

        if (!mongoose.connection.readyState)
            return res.status(500).json({ error: 'Database connection error' });

        // Fetch the course without videos
        const course = await courseModel.findOne({ _id: courseId }, { videos: 0 });
        console.log("Requested Course ID:", id);
        console.log("Course Details:", course);

        if (!course)
            return res.status(404).json({ message: 'No courses available' });

        const user = req.user;
        const purchasedCourses = user.purchased_courses.map(String);

        const isPurchased = purchasedCourses.includes(String(courseId));

        res.status(200).json({ ...course.toObject(), isPurchased });
    } catch (err) {
        console.error('Error fetching course:', err.message || err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.loggedInUserCourses = async (req, res) => {
    try {
        const userId = req.user.id
        if (!userId) return res.status(404).json({
            message: "user not found",
            success: false
        });

        const userCourses = await userModel.findOne({ _id: userId }, { purchased_courses: 1, })

        const courses = await courseModel.find({
            _id: { $in: userCourses.purchased_courses }
        });

        const Ncourses = await courseModel.find({
            _id: { $nin: userCourses.purchased_courses }
        })

        return res.status(200).json({
            userCourses: courses,
            yetToPurchase: Ncourses,
            success: true
        });
    } catch (err) {
        console.error('Error fetching courses:', err.message || err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.fetchVideos = async (req, res) => {
    try {
        const { courseid } = req.body;
        const course = await courseModel.findById(courseid);

        if (!course) return res.status(404).json({
            message: "Course not found",
            success: false
        });

        return res.status(200).json({
            videos: course.videos,
            course_name: course.course_title,
            success: true
        });

    } catch (err) {
        console.error('Error fetching courses:', err.message || err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.checkout = async (req, res) => {
    try {
        const user = req.user;
        const { courseId } = req.body;

        const result = await courseModel.findById(courseId, {
            course_description: 0,
            course_image: 0,
            detailed_description: 0,
            videos: 0,
        });

        if (!result) {
            return res.status(404).json({ error: "Course not found" });
        }

        const { course_title, course_price } = result;

        // Remove the dollar sign and convert to number
        const price = Number(course_price.replace('$', ''));

        // Create a Stripe session with metadata
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: course_title,
                        },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            billing_address_collection: "required",
            success_url: `http://localhost:4000/course/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:5173",
            metadata: {
                userId: user._id.toString(),
                courseId: courseId,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.paymentSuccess = async (req, res) => {
    try {
        const sessionId = req.query.session_id;

        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is missing" });
        }

        // Retrieve the Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ error: "Payment not completed" });
        }

        const { userId, courseId } = session.metadata;

        // Update the user's purchased_courses
        await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { purchased_courses: courseId } }, // Ensure no duplicates
            { new: true }
        );

        // Redirect the user to the frontend success page
        res.redirect(`http://localhost:5173/my-courses`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.storeReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { review, courseid } = req.body;

        if (!userId || !review) return res.status(400).json({
            message: "Bad request",
            success: false
        });

        const course = await courseModel.findById(courseid);
        const newReview = {
            userId,
            review_text: review
        }
        course.reviews.push(newReview)
        await course.save()
        return res.status(201).json({
          message: "Review Submitted",
          success: true
        });
        
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.fetchReview = async (req, res) => {
    try {
        const { courseId } = req.body;
        
        const course = await courseModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
            {   
                $unwind: "$reviews"
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "reviews.userId", 
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails" 
            },
            {
                $addFields: {
                    "reviews.email": "$userDetails.email" 
                }
            },
            {
                $project: {
                    _id: 0, 
                    "reviews.userId": 1,
                    "reviews.review_text": 1,
                    "reviews.email": 1 
                }
            }
        ]);

        res.send(course);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
