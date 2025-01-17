import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Card, CardContent, Typography, Box, Container, Grid, CardMedia, Button, CircularProgress, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar } from "@mui/material";

function CourseDetail() {
  const { courseId } = useParams(); 
  const navigate = useNavigate(); 
  const [course, setCourse] = useState(null); 
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseResponse = await fetch(`http://localhost:4000/course/getCourse/${courseId}`, {
          method: "GET",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course data");
        }

        const courseData = await courseResponse.json();
        setCourse(courseData); 

        // Fetch reviews
        const reviewsResponse = await fetch("http://localhost:4000/course/fetchReview", {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        });

        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData); // Set reviews data

      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchCourse(); 
  }, [courseId]);

  const handlePurchase = () => {
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">Course not found!</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box mb={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Go to All Courses
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            image={course.course_image}
            alt={course.course_title}
            sx={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
          <Box mt={2}>
            {!course.isPurchased ? (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePurchase}
              >
                Purchase Course
              </Button>
            ) : (
              <Typography variant="h6" color="success.main" align="center">
                You have already purchased this course.
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2" gutterBottom>
                {course.course_title}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Price: {course.course_price}
              </Typography>
              <Typography variant="body1" paragraph>
                {course.course_description}
              </Typography>
              <Box mt={2}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Detailed Description:
                </Typography>
                <Typography variant="body1" paragraph>
                  {course.detailed_description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box mt={4} sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Reviews
        </Typography>
        {reviews.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            There are no reviews for this course yet.
          </Typography>
        ) : (
          <List sx={{ width: '100%', maxWidth: 600, margin: '0 auto', bgcolor: 'background.paper' }}>
            {reviews.map((review, index) => (
              <div key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={review.reviews.email} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={review.reviews.email}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: 'text.primary', display: 'inline' }}
                      >
                        {review.reviews.review_text}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default CourseDetail;
