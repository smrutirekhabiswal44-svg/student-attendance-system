import CreateUser from "./pages/CreateUser";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";

const API_URL = "http://localhost:5000/api/students";

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };
}

// Protected Dashboard
function ProtectedDashboard({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "faculty") {
      return <Navigate to="/faculty-dashboard" replace />;
    }

    if (user.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

// Admin Dashboard
function Dashboard() {
  const [students, setStudents] = useState([]);
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch Students
  async function fetchStudents() {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStudents(data);

    } catch (error) {
      alert("Error loading students: " + error.message);
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Add or Update Student
  async function addStudent(e) {
    e.preventDefault();

    if (!rollNo.trim() || !name.trim() || !course.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const isEditing = editId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            rollNo: rollNo.trim(),
            name: name.trim(),
            course: course.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (isEditing) {
        setStudents(old =>
          old.map(s => s._id === editId ? data : s)
        );

        alert("Student updated successfully!");

      } else {
        setStudents(old => [...old, data]);

        alert("Student added successfully!");
      }

      cancelEdit();

    } catch (error) {
      alert(error.message);
    }
  }

  // Edit Student
  function startEdit(student) {
    setEditId(student._id);
    setRollNo(student.rollNo);
    setName(student.name);
    setCourse(student.course);
  }

  // Cancel Edit
  function cancelEdit() {
    setEditId(null);
    setRollNo("");
    setName("");
    setCourse("");
  }

  // Delete Student
  async function deleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setStudents(old => old.filter(s => s._id !== id));

      if (editId === id) {
        cancelEdit();
      }

      alert("Student deleted successfully!");

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="dashboard">

      <header className="header">
        <h1>Student Attendance System</h1>
        <p>Admin Panel - Manage Students</p>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="welcome">
        <h2>Welcome, Admin!</h2>
        <p>Manage student details and accounts here.</p>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Students</h3>
          <h1>{students.length}</h1>
        </div>
      </div>
    <CreateUser />
      <div className="student-section">

        <h2>
          {editId ? "Edit Student Details" : "Add New Student"}
        </h2>

        <form onSubmit={addStudent}>

          <input
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={e => setRollNo(e.target.value)}
          />

          <input
            placeholder="Enter Student Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            placeholder="Enter Course"
            value={course}
            onChange={e => setCourse(e.target.value)}
          />

          <button type="submit">
            {editId ? "Update Student" : "Add Student"}
          </button>

          {editId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}

        </form>

        <h2>Student Details</h2>

        <table>
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4">No students added yet.</td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student._id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>

                  <td>
                    <button onClick={() => startEdit(student)}>
                      Edit
                    </button>

                    <button onClick={() => deleteStudent(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedDashboard allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedDashboard allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedDashboard>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedDashboard allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedDashboard>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;