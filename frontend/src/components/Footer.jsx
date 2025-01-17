import { Box, Typography, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        padding: '32px 0',
        marginTop: '40px',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        {/* Footer Heading */}
        <Typography variant="h6" color="white" gutterBottom>
          Featured Courses
        </Typography>
        
        {/* List of Courses */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="white">
            - Web Development Basics
          </Typography>
          <Typography variant="body2" color="white">
            - Advanced JavaScript
          </Typography>
          <Typography variant="body2" color="white">
            - Data Science with Python
          </Typography>
          <Typography variant="body2" color="white">
            - Machine Learning Essentials
          </Typography>
          <Typography variant="body2" color="white">
            - UI/UX Design Fundamentals
          </Typography>
        </Box>

        {/* Footer Text */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          © {new Date().getFullYear()} Your App Name. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
