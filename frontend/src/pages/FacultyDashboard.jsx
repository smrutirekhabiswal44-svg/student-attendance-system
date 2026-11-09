import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function FacultyDashboard() {
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [marked, setMarked] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };

    // Load Students
    useEffect(() => {
        fetchStudents();
    }, []);

    // Load Attendance for Selected Date
    useEffect(() => {
        if (date) {
            fetchAttendance();
        }
    }, [date]);

    async function fetchStudents() {
        try {
            const response = await fetch(`${API_URL}/students`, {
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setStudents(data);

        } catch (error) {
            alert("Error loading students: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchAttendance() {
        try {
            const response = await fetch(
                `${API_URL}/attendance/date/${date}`,
                { headers }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            const attendanceData = {};

            data.forEach(item => {
                attendanceData[item.student] = item.status;
            });

            setMarked(attendanceData);

        } catch (error) {
            alert("Error loading attendance: " + error.message);
        }
    }

    // Mark Attendance
    async function markAttendance(studentId, status) {
        try {
            const response = await fetch(`${API_URL}/attendance/mark`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                body: JSON.stringify({
                    studentId,
                    date,
                    status
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMarked(old => ({
                ...old,
                [studentId]: status
            }));

            alert("Attendance saved successfully!");

        } catch (error) {
            alert(error.message);
        }
    }

    // Logout
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="dashboard">

            <header className="header">
                <h1>Faculty Dashboard</h1>
                <p>Manage Student Attendance</p>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <div className="student-section">

                <h2>Mark Student Attendance</h2>

                <label>Select Attendance Date: </label>

                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />

                <h2>Student List</h2>

                {loading ? (
                    <p>Loading students...</p>
                ) : students.length === 0 ? (
                    <p>No students found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Roll No.</th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Attendance</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.rollNo}</td>
                                    <td>{student.name}</td>
                                    <td>{student.course}</td>

                                    <td>
                                        {marked[student._id] || "Not Marked"}
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                markAttendance(
                                                    student._id,
                                                    "Present"
                                                )
                                            }
                                        >
                                            Present
                                        </button>

                                        <button
                                            onClick={() =>
                                                markAttendance(
                                                    student._id,
                                                    "Absent"
                                                )
                                            }
                                        >
                                            Absent
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}

export default FacultyDashboard;