const express = require("express");
const router = express.Router();

const Student = require("../models/Students.js");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// GET: Admin and Faculty can view all students
router.get(
    "/",
    authenticate,
    authorize("admin", "faculty"),
    async (req, res) => {
        try {
            const students = await Student.find();
            res.json(students);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// POST: Only Admin can add students
router.post(
    "/",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        try {
            const { rollNo, name, course } = req.body;

            if (!rollNo || !name || !course) {
                return res.status(400).json({
                    message: "Please fill all fields"
                });
            }

            const student = new Student({ rollNo, name, course });
            const savedStudent = await student.save();

            res.status(201).json(savedStudent);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Roll number already exists"
                });
            }

            res.status(500).json({ message: error.message });
        }
    }
);

// PUT: Only Admin can update student details
router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        try {
            const { rollNo, name, course } = req.body;

            if (!rollNo || !name || !course) {
                return res.status(400).json({
                    message: "Please fill all fields"
                });
            }

            const student = await Student.findByIdAndUpdate(
                req.params.id,
                { rollNo, name, course },
                { new: true, runValidators: true }
            );

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.json(student);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Roll number already exists"
                });
            }

            res.status(500).json({ message: error.message });
        }
    }
);

// PATCH: Admin and Faculty can mark attendance
router.patch(
    "/:id/attendance",
    authenticate,
    authorize("admin", "faculty"),
    async (req, res) => {
        try {
            const { attendance } = req.body;

            if (!["Present", "Absent"].includes(attendance)) {
                return res.status(400).json({
                    message: "Invalid attendance status"
                });
            }

            const student = await Student.findByIdAndUpdate(
                req.params.id,
                { attendance },
                { new: true, runValidators: true }
            );

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.json(student);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// DELETE: Only Admin can delete students
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        try {
            const student = await Student.findByIdAndDelete(req.params.id);

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            res.json({
                message: "Student deleted successfully"
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;