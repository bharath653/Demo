import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screen/login";
import Register from "./screen/register";
import Chat from "./screen/chat";

const PrivateRoute = ({ children }) => {
    return localStorage.getItem("authToken") ? children : <Navigate to="/" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
