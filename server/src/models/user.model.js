import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(

    {
        userName: {
            type: String,
            required: [true, "User name required"],
            lowercase: true,
            trim: true,
            unique: [true, "User name is already used. Try different"],
        },

        userNumber: {
            type: Number,
            required: [true, "User number required"],
            trim: true,
        },

        userEmail: {
            type: String,
            required: [true, "User email required"],
            lowercase: true,
            trim: true,
            unique: [true, "User email is already used"],
        },

        userPassword: {
            type: String,
            required: [true, "User password required"],
            select: false
        },

        userProfileImage: {
            type: String,
            required: [true, "User profile image required"],
            trim: true,
        },

        userAddress: {
            type: String,
            trim: true,
            default: null
        },

        userRole: {
            type: String,
            trim: true,
            enum: {
                values: ["user", "admin"],
                message: `Only user and admin are allowed. {VALUE} is incorrect`
            },
            lowercase: true,
            default: 'admin'
        },

        userIsBlocked: {
            type: String,
            trim: true,
            enum: {
                values: ["active", "blocked"],
                message: `Only active and blocked are allowed. {VALUE} is incorrect`
            },
            lowercase: true,
            default: 'active'
        },

        userAuthProvider: {
            type: String,
            trim: true,
            enum: {
                values: ["email", "google"],
                message: `Only email and google are allowed.{VALUE} is incorrect`
            },
            lowercase: true,
            default: 'email'
        },

        refreshToken: {
            type: String,
            default: null
        },

        resetOTP: {
            type: Number,
            default: null
        },

        resetOTPExpiryTime: {
            type: Date,
            default: null
        },

        userIsVerified: {
            type: Boolean,
            default: false
        },

        userGoogleId: {
            type: String,
            default: null
        },

        verifyOTP: {
            type: Number,
            default: null
        },

        verifyOTPExpiryTime: {
            type: Date,
            default: null
        },

        userNoOfAttempts: {
            type: Number,
            default: 0
        },

        lastSeenOTPAt: {
            type: Date,
            default: null
        },

        sessionStartedAt: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
)


userSchema.pre('save', async function () {

    if (!this.isModified('userPassword')) return;

    this.userPassword = await bcrypt.hash(this.userPassword, 10);
})

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            userEmail: this.userEmail
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIM_SECONDS
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME_SECONDS
        }
    )
}

export const User = mongoose.model("User", userSchema);