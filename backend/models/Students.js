const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    attendance: {
        type: String,
        enum: ["Not Marked", "Present", "Absent"],
        default: "Not Marked"
    }
});

module.exports = mongoose.model("Student", studentSchema);