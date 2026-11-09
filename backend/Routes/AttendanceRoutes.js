const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Students");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// Faculty marks attendance
router.post(
    "/mark",
    authenticate,
    authorize("faculty"),
    async (req, res) => {
        try {
            const { studentId, date, status } = req.body;

            if (!studentId || !date || !status) {
                return res.status(400).json({
                    message: "Please provide all attendance details"
                });
            }

            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({
                    message: "Invalid date format. Use YYYY-MM-DD"
                });
            }

            const parsedDate = new Date(date + "T00:00:00Z");

            if (
                Number.isNaN(parsedDate.getTime()) ||
                parsedDate.toISOString().slice(0, 10) !== date
            ) {
                return res.status(400).json({
                    message: "Invalid date"
                });
            }

            if (!["Present", "Absent"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid attendance status"
                });
            }

            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const attendance = await Attendance.findOneAndUpdate(
                {
                    student: studentId,
                    date: date
                },
                {
                    $set: {
                        status: status,
                        markedBy: req.user._id
                    }
                },
                {
                    new: true,
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );

            res.json({
                message: "Attendance saved successfully",
                attendance
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);
// Faculty views attendance for a selected date
router.get(
    "/date/:date",
    authenticate,
    authorize("faculty"),
    async (req, res) => {
        try {
            const date = req.params.date;

            const attendance = await Attendance.find({ date });

            res.json(attendance);

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Student views only their own attendance history
router.get(
    "/my-history",
    authenticate,
    authorize("student"),
    async (req, res) => {
        try {
            if (!req.user.rollNo) {
                return res.status(404).json({
                    message: "Roll number is not linked to your account"
                });
            }

            const student = await Student.findOne({
                rollNo: req.user.rollNo
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student record not found"
                });
            }

            const attendance = await Attendance.find({
                student: student._id
            }).sort({ date: -1 });

            const totalDays = attendance.length;

            const presentDays = attendance.filter(
                item => item.status === "Present"
            ).length;

            const absentDays = attendance.filter(
                item => item.status === "Absent"
            ).length;

            const percentage = totalDays === 0
                ? 0
                : Math.round((presentDays / totalDays) * 100);

            res.json({
                student: {
                    name: student.name,
                    rollNo: student.rollNo,
                    course: student.course
                },
                attendance,
                totalDays,
                presentDays,
                absentDays,
                percentage
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Admin and Faculty view one student's attendance history
router.get(
    "/student/:studentId",
    authenticate,
    authorize("admin", "faculty"),
    async (req, res) => {
        try {
            const student = await Student.findById(
                req.params.studentId
            );

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const attendance = await Attendance.find({
                student: student._id
            }).sort({ date: -1 });

            res.json({
                student,
                attendance
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

module.exports = router;