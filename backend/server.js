const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const StudentRoutes = require("./Routes/StudentRoutes.js");
const AuthRoutes = require("./Routes/auth.js");
const AttendanceRoutes = require("./Routes/AttendanceRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((error) => console.log("MongoDB Error:", error));

// Home Route
app.get("/", (req, res) => {
    res.send("Student Attendance System Backend Running");
});

// API Routes
app.use("/api/students", StudentRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/attendance", AttendanceRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});