const express = require("express");

const {
    registerUser,
    loginUser,
} = require("../controllers/auth.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// CURRENT USER
router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});

module.exports = router;