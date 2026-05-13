const jwt = require("jsonwebtoken");

const authMiddleware = async(req, res, next) => {
    try {
        console.log(req.headers.authorization);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }

        const token = authHeader.split(" ")[1];

        console.log(token);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};

module.exports = authMiddleware;