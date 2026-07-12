const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { success, error } = require('../utils/responseHelper');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token, access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: {
                id: decoded.id
            },
            attributes: ["id", "name", "email", "role"]
        });

        if (!user) {
            return res.status(401).json({
                message: "Account no longer active"
            });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return error(res, "Invalid or expired token", null, 401)
    }
}

module.exports = { verifyToken };