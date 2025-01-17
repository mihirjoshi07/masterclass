import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function ImgMediaCard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch courses with credentials (cookies)
    fetch("http://localhost:4000/course/listCourses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials (cookies)
    })
      .then((response) => response.json())
      .then((data) => {
        setCourses(data); // Set the course data into state
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);
  const handleBuy = (courseId) => {
    fetch("http://localhost:4000/course/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ courseId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Error: Invalid response from server");
        }
      })
      .catch((error) => console.error("Error during checkout:", error));
  };
  

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "16px",
        flexWrap: "wrap",
        marginTop: "64px", // Add space for the navbar
      }}
    >
      {courses.map((course, index) => (
        <Card
          key={index}
          sx={{
            maxWidth: 345,
            display: "flex",
            flexDirection: "column",
            height: 360,
          }}
        >
          {/* Wrap the image with Link */}
          <Link to={course.isPurchased ? `/my-courses` : `/course/${course._id}`}>
            <CardMedia
              component="img"
              alt={course.course_title}
              sx={{
                height: 150,
                objectFit: "cover",
                cursor: "pointer", // Add a pointer cursor to indicate it's clickable
              }}
              image={`/assets/${course.course_image}`}
            />
          </Link>

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5">
              {course.course_title}
            </Typography>
            {/* Conditionally display price if not purchased */}
            {!course.isPurchased && (
              <Typography gutterBottom variant="h6">
                {course.course_price}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {course.course_description}
            </Typography>
            {/* Display message for purchased courses */}
            {course.isPurchased && (
              <Typography variant="body2" sx={{ color: "green", marginTop: 1 }}>
                You have already purchased this course.
              </Typography>
            )}
          </CardContent>

          <CardActions>
            {/* Conditionally render buttons and links */}
            {course.isPurchased ? (
              <Link to="/my-courses">
                <Button size="small">Go to My Courses</Button>
              </Link>
            ) : (
              <>
                <Button size="small" onClick={() => handleBuy(course._id)}>
                  Buy
                </Button>
                <Link to={`/course/${course._id}`}>
                  <Button size="small">Show More</Button>
                </Link>
              </>
            )}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}
