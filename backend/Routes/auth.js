const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Student = require("../models/Students");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const count = await User.countDocuments();

        const role = count === 0 ? "admin" : "faculty";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// Admin creates Faculty or Student account
router.post(
    "/create-user",
    authenticate,
    authorize("admin"),
    async (req, res) => {
        try {
            const { name, email, password, role, rollNo } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    message: "Please fill all required fields"
                });
            }

            if (!["faculty", "student"].includes(role)) {
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            if (role === "student" && !rollNo) {
                return res.status(400).json({
                    message: "Roll number is required for Student"
                });
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            if (role === "student") {
                const student = await Student.findOne({
                    rollNo: rollNo.trim()
                });

                if (!student) {
                    return res.status(404).json({
                        message: "Student record not found. Add student first."
                    });
                }

                const existingStudentAccount = await User.findOne({
                    rollNo: rollNo.trim()
                });

                if (existingStudentAccount) {
                    return res.status(409).json({
                        message: "Account already exists for this roll number"
                    });
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                rollNo: role === "student" ? rollNo.trim() : undefined
            });

            await user.save();

            res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    rollNo: user.rollNo
                }
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            "mysecretkey",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNo: user.rollNo
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;