import React, { useState } from "react";

function CreateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("faculty");
    const [rollNo, setRollNo] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const userData = {
            name,
            email,
            password,
            role
        };

        if (role === "student") {
            userData.rollNo = rollNo;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/create-user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(userData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert("Account created successfully!");

            setName("");
            setEmail("");
            setPassword("");
            setRole("faculty");
            setRollNo("");

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="student-section">

            <h2>Create Faculty / Student Account</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                >
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                </select>

                {role === "student" && (
                    <input
                        type="text"
                        placeholder="Enter Student Roll Number"
                        value={rollNo}
                        onChange={e => setRollNo(e.target.value)}
                        required
                    />
                )}

                <button type="submit">
                    Create Account
                </button>

            </form>

        </div>
    );
}

export default CreateUser;