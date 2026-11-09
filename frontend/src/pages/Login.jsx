import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful!");

            if (user.role === "admin") {
                navigate("/dashboard");
            } 
            else if (user.role === "faculty") {
                navigate("/faculty-dashboard");
            } 
            else if (user.role === "student") {
                navigate("/student-dashboard");
            } 
            else {
                alert("Invalid user role");
            }

        } catch (error) {
    console.log("Login Error:", error);
    console.log("Server Response:", error.response?.data);

    alert(error.response?.data?.message || error.message);
}
    };

    return (
        <div className="auth-container">
            <h1>Student Attendance System</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <p>
                Don't have an account? Contact Admin.
            </p>
        </div>
    );
}

export default Login;