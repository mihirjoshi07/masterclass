const { listAllCourses, getSingleCourse, loggedInUserCourses, fetchVideos, checkout, paymentSuccess, storeReview, fetchReview } = require("../controllers/courseController");
const authMiddleware = require("../middleware/auth");

const router=require("express").Router();

router.get("/listCourses",authMiddleware,listAllCourses);
router.get("/getCourse/:id",authMiddleware,getSingleCourse);
router.get("/myCourses",authMiddleware,loggedInUserCourses);
router.post("/fetchVideos",authMiddleware,fetchVideos);
router.post("/checkout",authMiddleware,checkout);
router.post("/review",authMiddleware,storeReview);
router.post("/fetchReview",authMiddleware,fetchReview);
router.get("/payment-success",paymentSuccess);
module.exports=router;