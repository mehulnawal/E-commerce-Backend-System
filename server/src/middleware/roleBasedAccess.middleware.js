import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken';

export const checkRole = (...roles) => {
    return (req, res, next) => {
        try {

            // user must already be attached by authenticateUser
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!roles.includes(req.user.userRole)) {
                return res.status(403).json({ message: "Access Denied" });
            }


            next();

        } catch (error) {
            return res.status(500).json({
                message: "Error in role authorization"
            });
        }
    };
};