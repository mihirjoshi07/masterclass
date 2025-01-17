import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
export default function CourseVideos() {
    const { courseid } = useParams();
    const [videos, setVideos] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [loading, setLoading] = useState(true);
    const [review, setReview] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch("http://localhost:4000/course/fetchVideos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ courseid }),
                });

                const data = await response.json();
                if (data.success) {
                    setVideos(data.videos);
                    setCourseName(data.course_name);
                } else {
                    console.error("Failed to fetch videos:", data.message);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [courseid]);

    const handleReviewSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/course/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ courseid, review }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Review submitted successfully!");
                setReview(""); // Clear the Review field
            } else {
                console.error("Failed to submit review:", data.message);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    if (loading) {
        return <Typography>Loading videos...</Typography>;
    }

    return (
        <Box sx={{ marginTop: "64px", padding: "16px", marginX: "15%" }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    marginBottom: "24px",
                    textAlign: "center",
                    color: "#3f51b5",
                }}
            >
                {courseName}
            </Typography>

            {/* Video List */}
            <List>
                {videos.map((video) => (
                    <Link
                        key={video._id}
                        to={`/course/${courseid}/videos/${video._id}`}
                        state={{
                            videoTitle: video.title,
                            videoUrl: video.url,
                            course: courseName,
                        }}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <ListItem
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                marginBottom: "8px",
                                "&:hover": { backgroundColor: "#f9f9f9" },
                                padding: "8px",
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt={video.title}
                                    src={`/assets/${video.thumbNail}`}
                                    sx={{ width: 56, height: 56, marginRight: "16px" }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        {video.title}
                                    </Typography>
                                }
                                secondary={`Duration: ${video.duration} min`}
                            />
                        </ListItem>
                    </Link>
                ))}
            </List>

            {/* Review Form */}
            <Box
                component="form"
                onSubmit={handleReviewSubmit}
                sx={{
                    marginTop: "32px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "16px",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ marginBottom: "16px", fontWeight: "bold", textAlign: "center" }}
                >
                    Leave Your Review
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    label="Your Review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    sx={{ marginBottom: "16px" }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ padding: "10px" }}
                    disabled={!review.trim()}
                >
                    Submit Review
                </Button>
            </Box>
        </Box>
    );
}
