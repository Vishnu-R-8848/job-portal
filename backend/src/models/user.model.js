const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    role: {
        type: String,
        enum: ["seeker", "hr", "admin"],
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    token: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;