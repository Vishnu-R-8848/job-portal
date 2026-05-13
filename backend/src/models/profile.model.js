const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true,
    },

    bio: {
        type: String,
        default: "",
    },

    skills: {
        type: [String],
        default: [],
    },

    github: {
        type: String,
        default: "",
    },

    linkedin: {
        type: String,
        default: "",
    },

    portfolio: {
        type: String,
        default: "",
    },

    profileImage: {
        public_id: {
            type: String,
            default: "",
        },

        secure_url: {
            type: String,
            default: "",
        },
    },

    resume: {
        public_id: {
            type: String,
            default: "",
        },

        secure_url: {
            type: String,
            default: "",
        },
    },

    projects: [{
        title: String,
        description: String,
    }, ],

    experience: [{
        company: String,
        role: String,
    }, ],

    education: [{
        college: String,
        degree: String,
    }, ],

    onboardingCompleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const ProfileModel = mongoose.model(
    "profiles",
    profileSchema
);

module.exports = ProfileModel;