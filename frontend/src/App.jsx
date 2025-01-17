import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import {  useSelector } from "react-redux"; // Import necessary hooks
import ImgMediaCard from "./components/ImgMediaCard"; // Home page
import CourseDetail from "./components/CourseDetail"; // Course detail page component
import Signup from "./components/Signup"; // Signup page component
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Footer from "./components/Footer";
import MyCourses from "./components/MyCourses";
import CourseVideos from "./components/CourseVideos";
import VideoDetail from "./components/VideoDetail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  // const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth); // Access auth state from Redux

  return (
    <Router>
       <ToastContainer />
      {isLoggedIn && <Navbar />}
      <Routes>
        {/* Home page */}
        <Route path="/" element={isLoggedIn ? <ImgMediaCard /> : <Navigate to="/login" />} />

        {/* Course detail page */}
        <Route path="/course/:courseId" element={isLoggedIn ? <CourseDetail /> : <Navigate to="/login" />} />

        {/* Sign up page - Only accessible when not logged in */}
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />

        {/* Login page - Only accessible when not logged in */}
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />

        <Route path="/my-courses" element={isLoggedIn ? <MyCourses /> : <Navigate to="/login" />}/>
        <Route path="/my-courses/:courseid/videos" element={isLoggedIn ? <CourseVideos /> : <Navigate to="/login" />}/>
         {/* Video detail page */}
         <Route 
          path="/course/:courseid/videos/:videoid" 
          element={isLoggedIn ? <VideoDetail /> : <Navigate to="/login" />} 
        />
      </Routes>
      {isLoggedIn && <Footer />}
    </Router>
  );
}

export default App;
