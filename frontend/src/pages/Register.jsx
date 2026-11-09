import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password }
            );

            alert(response.data.message);
            navigate("/login");

        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <h1>Student Attendance System</h1>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

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

                <button type="submit">Register</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login Here</Link>
            </p>
        </div>
    );
}

export default Register;