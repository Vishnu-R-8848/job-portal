require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();

// MIDDLEWARES
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

module.exports = app;