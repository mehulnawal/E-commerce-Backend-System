import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";
import { Cart } from "../models/cart.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";

export const getAllCartItems = async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.user._id }).populate('productId');

        console.log("All Cart items - ", cart);

        return res.status(200).json(apiResponse({ status: 200, message: "All cart items fetched", data: cart }))

    } catch (error) {
        return res.status(500).json(apiError({ message: "Cannot fetch all cart items", error: error }));
    }
}

export const addToCart = async (req, res) => {
    try {

        /*
        1. get the product id and quantity 
        2. validate them 
        3. save them in the cart model
        4. send res to frontend
        */

        // 1. get the product id and quantity 
        const { id, quantity } = req.body;

        if (!id || !quantity)
            return res.status(404).json(apiError({ message: "Id and quantity both are required" }));

        // 2. validate them 

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json(apiError({ message: "Id is invalid" }));

        const qty = Number(quantity);

        if (!Number.isInteger(qty) || qty <= 0)
            return res.status(400).json(
                apiError({ message: "Quantity must be a positive integer" })
            );

        // 3. save them in the cart model

        // 
        const productExists = await Cart.findOne({ productId: id, userId: req.user._id });

        if (productExists) {

            productExists.quantity += qty;
            await productExists.save();

            const populatedProduct = await Product.findById(productExists._id).populate('productId');

            return res.status(200).json(apiResponse({ status: 200, message: "Product added to cart", data: populatedProduct }));
        }

        else {
            const newProduct = await Cart.create({
                productId: id,
                quantity,
                userId: req.user._id
            })

            const populatedProduct = await Product.findById(newProduct._id).populate('productId');

            console.log("New cart item- ", populatedProduct);

            // 4. send res to frontend
            return res.status(200).json(apiResponse({ status: 200, message: "Product added to cart", data: populatedProduct }))
        }

    } catch (error) {
        return res.status(500).json(apiError({ message: "Cannot add product to cart", error: error }));
    }
}