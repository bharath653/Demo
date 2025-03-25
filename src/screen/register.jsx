import React, { useState } from "react";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for button
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true); // Start loading state

        try {
            const response = await axios.post("http://localhost:5000/ChatAPP/auth/register", {
                name,
                email,
                password,
            });

            if (response.status === 201) {
                alert("Registration successful! You can now log in.");
                navigate("/");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <Box sx={{ width: "400px", margin: "auto", mt: 10 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
                    Register
                </Typography>

                <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
            </Paper>
        </Box>
    );
};

export default Register;
