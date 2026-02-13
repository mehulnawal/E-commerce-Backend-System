import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        },

        quantity: {
            type: Number,
            default: 1,
        },

        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    { timestamps: true }
)

export const Cart = mongoose.model("Cart", cartSchema);