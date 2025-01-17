import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function MyCourses() {
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [exploreCourses, setExploreCourses] = useState([]);
    // const navigate = useNavigate();

    useEffect(() => {
        // Fetch courses with credentials (cookies)
        fetch("http://localhost:4000/course/myCourses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials (cookies)
        })
            .then((response) => response.json())
            .then((data) => {
                setPurchasedCourses(data.userCourses || []);
                setExploreCourses(data.yetToPurchase || []);
            })
            .catch((error) => console.error("Error fetching courses:", error));
    }, []);

    return (
        <Box
            sx={{
                marginTop: "64px", // Add space for the navbar
                display: "flex",
                flexDirection: "column",
                gap: "32px",
            }}
        >
            {/* My Purchased Courses */}
            <Box sx={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: "16px",
                        fontWeight: "bold",
                        color: "#3f51b5", // Color for the title
                        textTransform: "uppercase", // Uppercase for more prominence
                        letterSpacing: "1px", // Adding letter spacing for better readability
                    }}
                >
                    My Purchased Courses
                </Typography>
                {purchasedCourses.length === 0 ? (
                    <Box sx={{ textAlign: "center", marginTop: "32px" }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                color: "black",
                                fontStyle: "italic",
                                fontSize: "1.2rem",
                                lineHeight: "1.5",
                            }}
                        >
                            No courses purchased yet. Start learning today!
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            gap: "16px",
                            flexWrap: "wrap",
                        }}
                    >
                        {purchasedCourses.map((course, index) => (
                            <Card
                                key={index}
                                sx={{
                                    maxWidth: 345,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 370,
                                    boxShadow: 3,
                                    borderRadius: "12px",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: 6,
                                    },
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                }}
                            >
                                <Link
                                    to={`/my-courses/${course._id}/videos`}
                                    style={{
                                        textDecoration: "none", // Remove underline from the link
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt={course.course_title}
                                        sx={{
                                            height: 200,
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            borderTopLeftRadius: "12px",
                                            borderTopRightRadius: "12px",
                                        }}
                                        image={`/assets/${course.course_image}`}
                                    />
                                    <CardContent sx={{ flexGrow: 1, paddingBottom: "8px" }}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            sx={{ fontWeight: "bold", color: "black" }}
                                        >
                                            {course.course_title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "black", fontStyle: "italic" }}
                                        >
                                            {course.course_description}
                                        </Typography>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Explore More Courses */}
            <Box sx={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: "16px",
                        fontWeight: "bold",
                        color: "#ff4081", // Different color for the second heading
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                    }}
                >
                    Explore More Courses
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    {exploreCourses.map((course, index) => (
                        <Card
                            key={index}
                            sx={{
                                maxWidth: 345,
                                display: "flex",
                                flexDirection: "column",
                                height: 370,
                                boxShadow: 3,
                                borderRadius: "12px",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: 6,
                                },
                                transition: "transform 0.3s, box-shadow 0.3s",
                            }}
                        >
                            <Link
                                to={`/course/${course._id}`}
                                style={{
                                    textDecoration: "none", // Remove underline from the link
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    alt={course.course_title}
                                    sx={{
                                        height: 200,
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderTopLeftRadius: "12px",
                                        borderTopRightRadius: "12px",
                                    }}
                                    image={`/assets/${course.course_image}`}
                                />
                                <CardContent sx={{ flexGrow: 1, paddingBottom: "8px" }}>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        sx={{ fontWeight: "bold", color: "black" }}
                                    >
                                        {course.course_title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "black", fontStyle: "italic" }}
                                    >
                                        {course.course_description}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "#ff4081", // Price in a highlighted color
                                        }}
                                    >
                                        {course.course_price}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
