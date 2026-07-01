const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const hireRequestsRoutes = require("./routes/hireRequests.routes");
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const lawyersRoutes = require("./routes/lawyers.routes");
const commentsRoutes = require("./routes/comments.routes");
const transactionsRoutes = require("./routes/transactions.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const systemSettingsRoutes = require("./routes/system-settings.routes");


const app = express();

app.use(
  cors({
     origin: [
      "http://localhost:3000",
      "https://project-lawyer-user-admin-client-si-eight.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use(express.json());

connectDB();

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/lawyers", lawyersRoutes);
app.use("/hire-requests", hireRequestsRoutes);
app.use( "/comments", commentsRoutes);
app.use( "/transactions", transactionsRoutes);
app.use( "/analytics", analyticsRoutes);
app.use( "/notifications", notificationsRoutes);
app.use( "/system-settings", systemSettingsRoutes);


app.get("/", (req, res) => {
  res.send("Lawyer Hiring Platform Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});