import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken';

export const checkRole = (...roles) => {

    return async (req, res, next) => {
        try {

            /*
                1. check token is present or not 
                2. then decode the token 
                3. check if user is present
            */

            // 1. check token is present or not 
            const { refreshToken } = req.cookies;

            if (!refreshToken)
                return res.status(401).json(apiResponse({ message: "Unauthorized" }));

            // 2. then decode the token 
            const decodeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

            // 3. check if user is present
            const user = await User.findById(decodeToken._id);

            if (!user)
                return res.status(401).json(apiResponse({ message: "Unauthorized" }));

            console.log("Allowed roles:", roles);
            console.log("User role:", user.userRole);

            // check user's roles
            if (!roles.includes(user.userRole)) {
                return res.status(403).json(apiError({ message: "Access Denied" }));
            }

            req.user = user;
            next();

        } catch (error) {
            return res.status(500).json(apiError({ message: "Error in authenticating user", error: error }));
        }

    }

}