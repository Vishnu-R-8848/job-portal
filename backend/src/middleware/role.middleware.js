// middlewares/role.middleware.js

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        try {
            // CHECK USER EXISTS
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            // CHECK ROLE
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            next();
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Role middleware error",
            });
        }
    };
};

module.exports = roleMiddleware;