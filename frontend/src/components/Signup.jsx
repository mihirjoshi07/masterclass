import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google"; // Import useGoogleLogin
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // Import dispatch
import { loginSuccess } from "../redux/authSlice"; // Import loginSuccess action
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc"; // Import the Google icon

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    try {
      // Make the API call to backend for sign up
      const response = await axios.post(
        "http://localhost:4000/auth/signUp", // Adjust the endpoint as necessary
        { email, password },
        { withCredentials: true } // Important to include cookies with the request
      );

      if (response.status === 201) {
        console.log("User signed up successfully:", response.data);
        // Dispatch the loginSuccess action to Redux store
        dispatch(loginSuccess(response.data.user)); // Store user data in Redux

        navigate("/"); // Redirect to home page after a successful signup
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("Signup failed. Please try again.");
    }
  };

  // Google Login handler
  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (authResult) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/auth/google?code=${authResult.code}`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data?.user) {
          const { email, _id } = response.data.user;
          dispatch(loginSuccess({ _id, email }));
          notifySuccess("Logged in with Google successfully!");
          navigate("/");
        } else {
          notifyError("Unexpected response from the server.");
        }
      } catch (error) {
        console.log(error);
        notifyError("Google login failed.");
      }
    },
    onError: () => {
      notifyError("Google login was unsuccessful.");
    },
  });

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form onSubmit={handleSignup} style={{ width: "100%" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            {/* Google OAuth */}
            <Button
              onClick={handleGoogleLogin}
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: "bold",
                color: "#4285F4",
                borderColor: "#4285F4",
              }}
              startIcon={<FcGoogle />} // Place the icon on the left
            >
              Sign up with Google
            </Button>

            {/* Link to login page if user already registered */}
            <Button
              onClick={() => navigate("/login")}
              fullWidth
              variant="text"
              sx={{ mt: 2 }}
            >
              Already registered? Go to Login
            </Button>
          </form>
        </Box>
      </Container>

      <ToastContainer />
    </>
  );
}

export default Signup;
