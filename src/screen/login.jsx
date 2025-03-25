import React, { useState } from "react";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin =async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if ( email &&  password) {
            const response = await axios.post("http://localhost:5000/ChatAPP/auth/login", {
                email,
                password,
            });
            console.log("response",response);
            if (response.status === 201) {
            
            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user",response.data.data._id);
            navigate("/chat");
            }
          
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <Box sx={{ width: "400px", margin: "auto", mt: 10 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
                    Login
                </Typography>

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

                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
                    Login
                </Button>

                <Button variant="text" fullWidth sx={{ mt: 1 }} onClick={() => navigate("/register")}>
                    Don't have an account? Register
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;

