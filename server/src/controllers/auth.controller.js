import { generateAccessAndRefreshToken } from "../config/generateTokens.config.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import bcrypt from 'bcrypt';
import { apiResponse } from "../utils/apiResponse.js";
import cloudinary from "../config/cloudinary.config.js";
import transporter from "../config/nodemailer.config.js";
import fs from 'fs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {

        /*
        1. get email, password from frontend
        2. validate the email and check if email exits or not  
        3. check if password is correct 
        4. if correct then -> generate refresh and access tokens 
        5. save the refresh token and update the user's data
        6. send response to frontend
        */

        // 1. get email, password from frontend
        const { userEmail, userPassword } = req.body;

        if (!userEmail)
            return res.status(400).json(apiError({ status: 400, message: "Email is required" }));

        if (!userPassword)
            return res.status(400).json(apiError({ status: 400, message: "Password is required" }));


        // 2. check if email exits or not 
        const userRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        if (!userRegex.test(userEmail))
            return res.status(400).json(apiError({ status: 400, message: "Email format is wrong" }));

        const user = await User.findOne({ userEmail }).select("+userPassword");

        if (!user)
            return res.status(400).json(apiError({ status: 400, message: "User does not exists" }));

        console.log(userPassword);
        console.log(user.userPassword);


        // 3. check if password is correct 
        const isPasswordCorrect = await bcrypt.compare(userPassword, user.userPassword);

        if (!isPasswordCorrect)
            return res.status(400).json(apiError({ status: 400, message: "Password is wrong" }));


        // 4. if correct then -> generate refresh and access tokens 
        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id);

        user.sessionStartedAt = new Date();
        await user.save({ validateBeforeSave: false });

        // 5. send response to frontend
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        const safeUser = user.toObject();
        delete safeUser.userPassword;

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);
        res.status(200).json(apiResponse({ message: "Login successful", data: safeUser }));

    } catch (error) {
        res.status(200).json(apiError({ message: "Cannot login user", error: error }));
    }
}

export const logout = async (req, res) => {
    try {

        /*
        1. get refreshToken from cookies
        2. find user 
        3. Clear cookies 
        4. Clear refresh token in user' db
        5. send res
        */

        // 1. get refreshToken from cookies
        const { refreshToken } = req.cookies;

        if (!refreshToken)
            return res.status(400).json(apiError({ status: 400, message: "No refresh token found" }));

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        );


        // 2. find user
        const user = await User.findByIdAndUpdate(decoded._id, {
            refreshToken: null
        });

        if (!user)
            return res.status(400).json(apiError({ status: 400, message: "User not found" }));

        // 3. Clear cookies 
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        res.clearCookie('accessToken', options);
        res.clearCookie('refreshToken', options);

        // 4. Clear refresh token in user' db
        await user.save({ validateBeforeSave: false });

        // 5. send res
        const safeUser = await User.findById(user._id).select("-userPassword -refreshToken")

        return res.status(200).json(apiResponse({ message: "User logout successfully", data: safeUser }));

    } catch (error) {
        res.status(500).json(apiError({ message: "Cannot logout user", error: error }));
    }
}

export const register = async (req, res) => {
    try {

        /*
        1. get user details - userName, userEmail, userPassword, userNumber, userProfileImage
        2. check if user already exits
        3. validate all the details 
        4. upload user's image to cloudinary
        5. generate refresh and access token
        6. save the user's data in db
        7. send resp 
        */

        // 1. get user details - userName, userEmail, userPassword, userNumber, userProfileImage
        const { userEmail, userPassword, userName, userNumber } = req.body;

        if (!userEmail)
            return res.status(400).json(apiError({ status: 400, message: "Email is required" }));

        if (!userPassword)
            return res.status(400).json(apiError({ status: 400, message: "Password is required" }));

        if (!userName)
            return res.status(400).json(apiError({ status: 400, message: "First name is required" }));

        if (!userNumber)
            return res.status(400).json(apiError({ status: 400, message: "Number is required" }));

        // 2. check if user already exits
        const user = await User.findOne({ userEmail });

        if (user)
            return res.status(400).json(apiError({ status: 400, message: "User already exists" }));


        // 3. validate all the details 
        const userEmailRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        if (!userEmailRegex.test(userEmail))
            return res.status(400).json(apiError({ status: 400, message: "Email format is wrong" }));

        const userPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&$])[a-zA-Z0-9@&$]{8,}$/;

        if (!userPasswordRegex.test(userPassword))
            return res.status(400).json(apiError({ status: 400, message: "Password format invalid. One Uppercase, one lowercase , one number and one character between @&$ and min length should be 8" }));

        const userNameRegex = /^[a-zA-Z0-9]+$/;
        if (!userNameRegex.test(userName))
            return res.status(400).json(apiError({ status: 400, message: "First name can only contains characters" }));

        const userNumberRegex = /^[0-9]{10}$/;
        if (!userNumberRegex.test(userNumber))
            return res.status(400).json(apiError({ status: 400, message: "Number is wrong" }));

        // 4. upload user's image to cloudinary
        let userImage = '';

        if (req.file && req.file.path) {

            console.log(`User profile image path from multer - ${req.file.path}`);

            const imageInstance = await cloudinary.uploader.upload(req.file.path,
                { folder: 'lnCookies', resource_type: 'auto' }
            );

            userImage = imageInstance.secure_url;

            fs.unlinkSync(req.file.path);

            console.log("File uploaded to cloudinary successful")
        }
        else {
            console.log("Not getting image from multer");
            return res.status(400).json(apiError({ status: 400, message: "No image found" }));
            // process.exit();
        }

        // 5. save the user's data in db
        const newUser = new User({
            userEmail,
            userPassword,
            userNumber,
            userName,
            userProfileImage: userImage,
            sessionStartedAt: new Date()
        })

        await newUser.save();

        // 6. generate refresh and access token
        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(newUser._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }

        // 7. send resp 
        const safeUser = await User.findById(newUser._id).select("-userPassword -refreshToken")

        res.cookie('accessToken', accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json(apiResponse({ message: "Register successful", data: safeUser }));

    } catch (error) {

        res.status(500).json(apiError({ message: "Cannot register user", error: error }));
    }
}

export const forgetPassword = async (req, res) => {
    try {

        /*
        1. get user email
        2. check if user exists or not 
        3. adding countdown of 30 second 
        4. generate otp
        5. send the mail to user
        6. save otp in user's db
        */

        // 1. get user email
        const { userEmail } = req.body

        if (!userEmail)
            return res.status(400).json(apiError({ status: 400, message: "Email is required", error: "Email is required for forget password" }));

        // 2. check if user exists or not 
        const userEmailRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        if (!userEmailRegex.test(userEmail))
            return res.status(400).json(apiError({ status: 400, message: "Email format is wrong" }));

        const user = await User.findOne({ userEmail }).select("+userPassword");

        if (!user)
            return res.status(400).json(apiError({ status: 400, message: "User does not exists" }));

        // 3. adding countdown of 30 second so to ensure no spam/bulk request
        if (user.lastSeenOTPAt && Date.now() - user.lastSeenOTPAt.getTime() < 30 * 1000) {
            return res.status(429).json(apiError({ message: "Please wait 30 seconds before requesting another OTP" }));
        }

        // 4. generate a otp
        const OTP = Math.floor((10000 + Math.random() * 90000));

        // Math.random - 0.00 to 0.99
        //  90000 -> 89999

        // 5. send the otp to user's email
        const message = {
            from: `"LN Cookies" <${process.env.OWNER_GMAIL}>`,
            to: userEmail,
            subject: "Your OTP for Password Reset",

            text: `
            Hello ${user.userName},

            You requested to reset your password.

            Your One-Time Password (OTP) is:
            ${OTP}

            This OTP is valid for 10 minutes.
            Please do not share this OTP with anyone.

            If you did not request this, please ignore this email.

            Regards,
            LN Cookies Team
            `,

            html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Password Reset OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color:#f6f6f6; padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <table width="600" style="background:#ffffff; padding:30px; border-radius:8px;">
                            
                            <tr>
                                <td style="text-align:center;">
                                    <h2 style="color:#333;">Password Reset OTP</h2>
                                </td>
                            </tr>

                            <tr>
                                <td style="font-size:16px; color:#555;">
                                    <p>Hello <strong>${user.userName}</strong>,</p>

                                    <p>
                                        You requested to reset your password.
                                        Use the OTP below to proceed:
                                    </p>

                                    <p style="font-size:24px; font-weight:bold; letter-spacing:3px; text-align:center;">
                                        ${OTP}
                                    </p>

                                    <p>
                                        This OTP is valid for <strong>10 minutes</strong>.
                                        Please do not share it with anyone.
                                    </p>

                                    <p>
                                        If you did not request this, please ignore this email.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding-top:20px; font-size:14px; color:#888; text-align:center;">
                                    <p>— LN Cookies Team</p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
        };

        await transporter.sendMail(message);

        // 6. save otp in user's db
        const expiryTime = new Date(Date.now() + 15 * 60 * 1000)

        user.resetOTP = OTP;
        user.resetOTPExpiryTime = expiryTime;
        user.lastSeenOTPAt = new Date();

        await user.save({ validateBeforeSave: false });

        return res.status(200).json(apiResponse({ message: "OTP send successfully", data: user.userEmail }));


    } catch (error) {
        res.status(500).json(apiError({ message: "Cannot forget password", error: error }));
    }
}

export const resetPassword = async (req, res) => {
    try {

        /*
        1. get otp, newPassword 
        2. check otp expiry time 
        3. verify otp with the saved otp in db
        4. validate newPassword
        5. send response
        */

        // 1. get otp, newPassword
        const { otp, newPassword, userEmail } = req.body;

        if (!otp)
            return res.status(400).json(apiError({ status: 400, message: "OTP is required", error: "OTP is required for reset password" }));

        if (!newPassword)
            return res.status(400).json(apiError({ status: 400, message: "Password is required", error: "Password is required for reset password" }));

        const user = await User.findOne({ userEmail }).select('+userPassword');

        if (!user)
            return res.status(400).json(apiError({ status: 400, message: "User not exits" }));


        // 2. check otp expiry time 
        if (Date.now() > user.resetOTPExpiryTime)
            return res.status(400).json(apiError({ status: 400, message: "OTP is expired." }));


        // 3. verify otp with the saved otp in db
        if (Number(otp) != user.resetOTP)
            return res.status(400).json(apiError({ status: 400, message: "Invalid OTP" }));

        // 4. validate newPassword
        const userPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&$])[a-zA-Z0-9@&$]{8,}$/;

        if (!userPasswordRegex.test(newPassword))
            return res.status(400).json(apiError({ status: 400, message: "Password format invalid. One Uppercase, one lowercase , one number and one character between @&$ and min length should be 8" }));

        user.userPassword = resetPassword;
        user.resetOTP = 0;
        user.resetOTPExpiryTime = null;
        user.lastSeenOTPAt = new Date();;
        await user.save({ validateBeforeSave: false });


        // 5. send response
        return res.status(200).json(
            apiResponse({
                message: "Password reset successful. Please login again."
            })
        );

    } catch (error) {
        res.status(500).json(apiError({ message: "Cannot reset password", error: error }));
    }
}

export const verifyUser = async (req, res) => {
    try {

        /*
        1. get user email
        2. check if user exists or not 
        3. adding countdown of 30 second 
        4. generate otp
        5. send the mail to user
        6. save otp in user's db
        */

        // 1. get user email
        const { userEmail } = req.body

        if (!userEmail)
            return res.status(400).json(apiError({ status: 400, message: "Email is required", error: "Email is required to verify user" }));

        // 2. check if user exists or not 
        const userEmailRegex = /^[a-zA-Z0-9.%-+]+@[a-zA-Z0-9-+]+\.[a-zA-Z]{2,}$/;
        if (!userEmailRegex.test(userEmail))
            return res.status(400).json(apiError({ status: 400, message: "Email format is wrong" }));

        const user = await User.findOne({ userEmail }).select("+userPassword");

        if (!user)
            return res.status(400).json(apiError({ status: 400, message: "User does not exists" }));

        // 3. adding countdown of 30 second so to ensure no spam/bulk request
        if (user.lastSeenOTPAt && Date.now() - user.lastSeenOTPAt.getTime() < 30 * 1000) {
            return res.status(429).json(apiError({ message: "Please wait 30 seconds before requesting another OTP" }));
        }

        // 4. generate a otp
        const OTP = Math.floor((10000 + Math.random() * 90000));

        // 5. send the otp to user's email
        const message = {
            from: `"LN Cookies" <${process.env.OWNER_GMAIL}>`,
            to: userEmail,
            subject: "Verify Your Email Address – LN Cookies",

            text: `
            Hello ${user.userName},

            Thank you for signing up with LN Cookies!

            To verify your email address, please use the One-Time Password (OTP) below:

            ${OTP}

            This OTP is valid for 10 minutes.
            Please do not share this OTP with anyone.

            If you did not create an account with LN Cookies, you can safely ignore this email.

            Regards,
            LN Cookies Team
            `,

            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Email Verification OTP</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color:#f6f6f6; padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                            <table width="600" style="background:#ffffff; padding:30px; border-radius:8px;">
                                
                                <tr>
                                    <td style="text-align:center;">
                                        <h2 style="color:#333;">Verify Your Email</h2>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="font-size:16px; color:#555;">
                                        <p>Hello <strong>${user.userName}</strong>,</p>

                                        <p>
                                            Thank you for creating an account with <strong>LN Cookies</strong>.
                                            To complete your registration, please verify your email address using the OTP below:
                                        </p>

                                        <p style="font-size:24px; font-weight:bold; letter-spacing:3px; text-align:center;">
                                            ${OTP}
                                        </p>

                                        <p>
                                            This OTP is valid for <strong>10 minutes</strong>.
                                            Please do not share it with anyone.
                                        </p>

                                        <p>
                                            If you did not sign up for LN Cookies, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-top:20px; font-size:14px; color:#888; text-align:center;">
                                        <p>— LN Cookies Team</p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `
        };

        await transporter.sendMail(message);

        // 6. save otp in user's db
        const expiryTime = new Date(Date.now() + 15 * 60 * 1000)

        user.verifyOTP = OTP;
        user.verifyOTPExpiryTime = expiryTime;
        user.lastSeenOTPAt = new Date();

        await user.save({ validateBeforeSave: false });

        return res.status(200).json(apiResponse({ message: "OTP send successfully", data: '' }));


    } catch (error) {
        res.status(500).json(apiError({ message: "Cannot verify user", error: error }));
    }
}

export const verifyUserOTP = async (req, res) => {
    try {

        /*
        1. get otp 
        2. check otp expiry time 
        3. verify otp with the saved otp in db
        5. send response
        */

        // 1. get otp, newPassword
        const { otp, userEmail } = req.body;

        if (!otp)
            return res.status(400).json(apiError({ status: 400, message: "OTP is required", error: "OTP is required for reset password" }));

        const user = await User.findOne({ userEmail }).select('+userPassword');

        if (!user)
            return res.status(400).json(apiError({ status: 400, message: "User not exits" }));


        // 2. check otp expiry time 
        if (Date.now() > user.resetOTPExpiryTime)
            return res.status(400).json(apiError({ status: 400, message: "OTP is expired." }));


        // 3. verify otp with the saved otp in db
        if (Number(otp) != user.verifyOTP)
            return res.status(400).json(apiError({ status: 400, message: "Invalid OTP" }));


        user.verifyOTP = 0;
        user.verifyOTPExpiryTime = null;
        user.lastSeenOTPAt = new Date();;

        await user.save({ validateBeforeSave: false });


        // 4. send response
        return res.status(200).json(
            apiResponse({
                message: "User verified successfully"
            })
        );

    } catch (error) {
        res.status(500).json(apiError({ message: "Cannot verified user with otp", error: error }));
    }
}

export const resetRefreshToken = async (req, res) => {
    try {

        /*
        1. get refresh token from cookie
        2. verify refresh token signature
        3. find user associated with refresh token
        4. validate refresh token against DB
        5. generate new access token
        6. send tokens in cookies
        */

        // 1. get refresh token from cookie
        const refreshTokenFromCookies = req.cookies.refreshToken;

        if (!refreshTokenFromCookies)
            return res.status(400).json(apiError({ message: "Cannot read refresh token" }));


        // 2. verify refresh token signature
        const decode = await jwt.verify(refreshTokenFromCookies, process.env.REFRESH_TOKEN_SECRET_KEY);

        // 3. find user associated with refresh token
        const user = await User.findById(decode._id);

        if (!user || !user.refreshToken)
            return res.status(401).json(apiError({ status: 401, message: "User not found" }));

        // 4. validate refresh token against DB
        const isValid = await bcrypt.compare(refreshTokenFromCookies, user.refreshToken);

        if (!isValid)
            return res.status(401).json(apiError({ message: "Refresh token reused or invalid" }));


        const sessionStartedAt = new Date(user.sessionStartedAt).getTime();
        let sessionExpiresAt = sessionStartedAt + process.env.SESSION_DURATION;

        if (Date.now() >= sessionExpiresAt || !user.sessionStartedAt) {
            user.refreshToken = null;
            user.sessionStartedAt = null;
            await user.save({ validateBeforeSave: false });

            res.clearCookie('accessToken', options);
            res.clearCookie("refreshToken", options);

            return res.status(401).json(
                apiError({ message: "Session expired. Please login again." })
            )
        }

        // 5. generate new access token
        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

        // 6. send tokens in cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }

        const safeUser = await User.findById(user._id).select("-userPassword -refreshToken")

        res.cookie('accessToken', accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json(apiResponse({ message: "Tokens reset", data: safeUser }));

    } catch (error) {
        res.status(500).json(apiError({ message: "Cannot reset refresh token", error: error }));
    }
}