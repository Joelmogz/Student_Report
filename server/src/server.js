const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://student-report-one.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Student Report API is live 🚀');
});

// Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin1234";
    let admin = await User.findOne({ email: adminEmail, role: "admin" });
    if (!admin) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        fullName: "Default Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "approved",
        isApproved: true,
      });
      await admin.save();
      console.log("Default admin created:", adminEmail);
    } else {
      console.log("Default admin already exists:", adminEmail);
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};

createDefaultAdmin();

// Mount routes here
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/students', require('./routes/studentRoute'));
app.use('/api/marks', require('./routes/marksRoute'));
app.use('/api/reevaluation-requests', require('./routes/reevaluationRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
