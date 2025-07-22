const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    marks: {
        type: Number,
    },
    grade: {
        type: String,
        enum: ["A", "B", "C", "D", "F"],
    },

    remarks: {
        type: String,
    },

}, { timestamps: true });

const Marks = mongoose.model("Marks", marksSchema);

module.exports = Marks;