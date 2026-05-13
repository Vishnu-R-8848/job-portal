const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

// ================= REGISTER =================

const registerUser = async(req, res) => {
    try {
        const { firstName, lastName, role, email, password } = req.body;

        if (!firstName || !lastName || !role || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            firstName,
            lastName,
            role,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({
                userId: newUser._id,
                role: newUser.role,
                email: newUser.email,
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d",
            },
        );

        newUser.token = token;

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,

            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// ================= LOGIN =================

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password required",
            });
        }

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign({
                userId: user._id,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d",
            },
        );

        user.token = token;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
            },
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
    registerUser,
    loginUser,
};