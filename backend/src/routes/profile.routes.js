const express = require("express");

const {
    createProfile,
    getMyProfile,
    updateProfile,
} = require("../controllers/profile.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// CREATE PROFILE
router.post("/create", authMiddleware, createProfile);

// GET MY PROFILE
router.get("/me", authMiddleware, getMyProfile);

// UPDATE PROFILE
router.put("/update", authMiddleware, updateProfile);

module.exports = router;