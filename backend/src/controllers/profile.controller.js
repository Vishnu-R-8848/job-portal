const ProfileModel = require("../models/profile.model");

/**
 * CREATE PROFILE
 */
const createProfile = async(req, res) => {
    try {
        const userId = req.user.userId;

        const {
            bio,
            skills,
            github,
            linkedin,
            portfolio,
            projects,
            experience,
            education,
        } = req.body;

        // CHECK EXISTING PROFILE
        const existingProfile = await ProfileModel.findOne({ user: userId });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Profile already exists",
            });
        }

        // CREATE PROFILE
        const newProfile = await ProfileModel.create({
            user: userId,
            bio,
            skills,
            github,
            linkedin,
            portfolio,
            projects,
            experience,
            education,
            onboardingCompleted: true,
        });

        // POPULATE USER DATA
        await newProfile.populate("user", "firstName lastName email role");

        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile: newProfile,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * GET MY PROFILE
 */
const getMyProfile = async(req, res) => {
    try {
        const userId = req.user.userId;

        const profile = await ProfileModel.findOne({ user: userId }).populate(
            "user",
            "firstName lastName email role"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/**
 * UPDATE PROFILE
 */
const updateProfile = async(req, res) => {
    try {
        const userId = req.user.userId;

        const {
            bio,
            skills,
            github,
            linkedin,
            portfolio,
            projects,
            experience,
            education,
        } = req.body;

        const updatedProfile = await ProfileModel.findOneAndUpdate({ user: userId }, {
            bio,
            skills,
            github,
            linkedin,
            portfolio,
            projects,
            experience,
            education,
        }, {
            new: true,
        }).populate("user", "firstName lastName email role");

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    createProfile,
    getMyProfile,
    updateProfile,
};