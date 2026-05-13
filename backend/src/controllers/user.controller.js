const cloudinary = require("../config/cloudinary");

const UserModel = require("../models/user.model");

// ================= UPLOAD PROFILE IMAGE =================

const uploadProfileImage = async(req, res) => {
    try {
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }

        const fileBase64 = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: "job-portal/profile-images",
        });

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, {
                profileImage: {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                },
            }, { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded",
            image: updatedUser.profileImage,
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
    uploadProfileImage,
};