const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role:{
        type: String,
        enum: ["admin", "student"],
        default: "student",
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },

    
    marks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marks",
    }],
    isApproved: {
        type: Boolean,
        default: false,
    },
    isRejected: {
        type: Boolean,
        default: false,
    },
    rejectedReason: {
        type: String,
    },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;