import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken';

export const authenticateUser = async (req, res, next) => {
    try {

        const { accessToken } = req.cookies;

        if (!accessToken)
            return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET_KEY
        );

        const user = await User.findById(decoded._id);

        if (!user)
            return res.status(401).json({ message: "Unauthorized" });

        req.user = user;
        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }

        return res.status(403).json({ message: "Invalid token" });
    }
};