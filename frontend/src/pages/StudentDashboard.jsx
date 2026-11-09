import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAttendance();
    }, []);

    // Get Student Attendance
    async function fetchAttendance() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/attendance/my-history",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setData(result);

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Logout
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    if (loading) {
        return <h2>Loading Attendance...</h2>;
    }

    return (
        <div className="dashboard">

            <header className="header">
                <h1>Student Dashboard</h1>
                <p>Welcome to Student Attendance System</p>
                <button onClick={handleLogout}>Logout</button>
            </header>

            {data && (
                <div className="student-section">

                    <h2>Welcome, {data.student.name}!</h2>

                    <p>Roll Number: {data.student.rollNo}</p>
                    <p>Course: {data.student.course}</p>

                    <div className="cards">

                        <div className="card">
                            <h3>Total Classes</h3>
                            <h1>{data.totalDays}</h1>
                        </div>

                        <div className="card">
                            <h3>Present</h3>
                            <h1>{data.presentDays}</h1>
                        </div>

                        <div className="card">
                            <h3>Absent</h3>
                            <h1>{data.absentDays}</h1>
                        </div>

                        <div className="card">
                            <h3>Attendance Percentage</h3>
                            <h1>{data.percentage}%</h1>
                        </div>

                    </div>

                    <h2>My Attendance History</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.attendance.length === 0 ? (
                                <tr>
                                    <td colSpan="2">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                data.attendance.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.date}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            )}

        </div>
    );
}

export default StudentDashboard;