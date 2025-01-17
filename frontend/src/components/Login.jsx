import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(loginSuccess(response.data.user));
        notifySuccess("Login successful!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password.";
      setError(errorMessage);
      notifyError(errorMessage);
    }
  };

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
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
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
              Login
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
              Sign in with Google
            </Button>

            {/* Sign Up Link */}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Typography variant="body2" color="textSecondary">
                {"Don't have an account? "}
                <Link href="/signUp" variant="body2">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>

      <ToastContainer />
    </>
  );
}

export default Login;
