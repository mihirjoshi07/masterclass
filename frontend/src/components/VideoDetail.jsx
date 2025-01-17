import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function VideoDetail() {
    const location = useLocation();
    const { videoTitle, videoUrl, course } = location.state || {};

    if (!videoTitle || !videoUrl) {
        return <Typography>Video not found</Typography>;
    }

    return (
        <Box sx={{ marginTop: "10px", padding: "16px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "24px" }}>
                {course}
            </Typography>
            <Typography variant="h6" >
                {videoTitle}
            </Typography>

            {/* Video Player */}
            <Box sx={{ position: "relative", paddingTop: "56.25%", height: 0, overflow: "hidden" }}>
                <ReactPlayer
                    url={videoUrl}
                    controls
                    width="100%"
                    height="70%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                />
            </Box>

           
        </Box>
    );
}
