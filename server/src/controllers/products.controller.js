import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from 'fs';

export const productsView = async (req, res) => {
    try {

        /*
        1. show all products
        2. send data to frontend
        */

        // 1. show all products
        const products = await Product.find({
            productStatus: 'published',
        }).populate({
            path: 'productCategory'
        });

        // 2. send data to frontend
        return res.status(200).json(apiResponse({ status: 200, message: "All products fetched", data: products || [] }))

    } catch (error) {
        return res.status(500).json(apiError({ message: "Cannot fetched all products", error: error }));
    }
}

export const addNewProduct = async (req, res) => {
    try {

        /*
        1. get name, price, description, images, category
        2. check category - name already present
        3. validate details
        4. upload images to cloudinary
        5. save product in db
        6. send product to frontend
        */

        // 1. get name, price, description, images, category
        const { productName, productPrice, productDescription, productCategory, productStatus } = req.body;

        if (!productName || !productPrice || !productDescription || !productCategory)
            return res.status(400).json(apiError({ status: 400, message: "Enter all product details" }));

        // 2. check category - name already present
        if (!mongoose.Types.ObjectId.isValid((productCategory)))
            return res.status(400).json(apiError({ status: 400, message: "Category id is invalid" }));

        const productAlreadyPresent = await Product.findOne({
            productName,
            productCategory
        }).populate("productCategory");

        if (productAlreadyPresent)
            return res.status(400).json(apiError({ status: 400, message: "Product already exists in this category" }));

        // 3. validate details
        const productNameRegex = /^[a-zA-Z0-9\s]+$/;
        const productDescriptionRegex = /^[\w\s.,\-:()&!@#$%^*+=\[\]{}|\\;'"<>/?`~\n]+$/;
        const productStatusRegex = ["published", "draft"];

        if (!productNameRegex.test(productName))
            return res.status(400).json(apiError({ status: 400, message: "Product name format is wrong" }));

        if (isNaN(productPrice) || Number(productPrice) <= 0)
            return res.status(400).json(apiError({ status: 400, message: "Product price can only contains number" }));

        if (!productDescriptionRegex.test(productDescription))
            return res.status(400).json(apiError({ status: 400, message: "Product description format is wrong" }));

        if (!productStatusRegex.includes(productStatus))
            return res.status(400).json(apiError({ status: 400, message: "Product status can only have the of draft or published" }));

        // 4. upload images to cloudinary
        if (!req.files || req.files.length === 0) {
            console.log("Cannot get image from multer");
            return res.status(400).json(
                apiResponse({
                    status: 400,
                    message: "No images uploaded"
                })
            );
        }

        const productImagesArray = [];
        for (const file of req.files) {
            const imageInstance = await cloudinary.uploader.upload(file.path);
            productImagesArray.push(imageInstance.secure_url);
            fs.unlinkSync(file.path);
        };

        // 5. save product in db

        const newProduct = new Product({
            productName,
            productPrice,
            productDescription,
            productImages: productImagesArray,
            productCategory,
            slug: productName,
            productStatus: productStatus || 'published',
            userId: req.user._id
        })
        await newProduct.save();

        const populatedProduct = await Product.findById(newProduct._id)
            .populate("productCategory");

        // 6. send product to frontend
        return res.status(200).json(apiResponse({ status: 200, message: "New Product added", data: populatedProduct }))

    } catch (error) {
        return res.status(500).json(apiError({ message: "Cannot add new product", error: error.message }));
    }
}

export const deleteProduct = async (req, res) => {
    try {

        /*
        1. get product id 
        2. validate id format 
        3. find product
        4. change its status from published to draft
        5. response frontend
        */

        // 1. get product id 
        const { productId } = req.params;

        if (!productId)
            return res.status(400).json(apiError({ status: 400, message: "Id is required" }));

        // 2. validate id format 
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json(apiError({ status: 400, message: "Invalid Id format" }));

        // 3. find product
        const product = await Product.findById(productId);

        if (!product)
            return res.status(400).json(apiError({ status: 400, message: "Product not found" }));

        // 4. change its status from published to draft
        product.productStatus = 'draft'
        await product.save();

        // 5. response frontend
        return res.status(200).json(apiResponse({ status: 200, message: "All products fetched", data: product }))

    } catch (error) {
        console.log("Error in deleting product - ", error);
        return res.status(500).json(apiError({ message: "Cannot delete product" }));
    }
}

export const productsDraftView = async (req, res) => {
    try {

        /*
        1. show all products
        2. send data to frontend
        */

        // 1. show all products
        const products = await Product.find({
            productStatus: 'draft'
        }).populate({
            path: 'productCategory'
        });

        // 2. send data to frontend
        return res.status(200).json(apiResponse({ status: 200, message: "All draft products fetched", data: products || [] }))

    } catch (error) {
        return res.status(500).json(apiError({ message: "Cannot fetched all trash products", error: error }));
    }
}

export const restoreDraftProduct = async (req, res) => {
    try {

        /*
        1. get product id 
        2. validate id format 
        3. find product
        4. change its status from published to draft
        5. response frontend
        */

        // 1. get product id 
        const { productId } = req.body;

        if (!productId)
            return res.status(400).json(apiError({ status: 400, message: "Id is required" }));

        // 2. validate id format 
        if (!mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json(apiError({ status: 400, message: "Invalid Id format" }));

        // 3. find product
        const product = await Product.findById(productId);

        if (!product)
            return res.status(400).json(apiError({ status: 400, message: "Product not found" }));

        // 4. change its status from draft to published
        product.productStatus = 'published'
        await product.save();

        const populatedProduct = await Product.findById(product._id)
            .populate("productCategory");

        // 5. response frontend
        return res.status(200).json(apiResponse({ status: 200, message: "Product restored", data: populatedProduct }))

    } catch (error) {
        console.log("Error in restoring product - ", error);
        return res.status(500).json(apiError({ message: "Cannot restore product" }));
    }
}

export const editProduct = async (req, res) => {
    try {

        // 1. get data
        const {
            productId,
            productName,
            productPrice,
            productDescription,
            productCategory,
            productStatus
        } = req.body;

        if (!productId || !productName || !productPrice || !productDescription || !productCategory) {
            return res.status(400).json(
                apiError({ status: 400, message: "Enter all product details" })
            );
        }

        // 2. validate ids
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json(
                apiError({ status: 400, message: "Product id is invalid" })
            );
        }

        if (!mongoose.Types.ObjectId.isValid(productCategory)) {
            return res.status(400).json(
                apiError({ status: 400, message: "Category id is invalid" })
            );
        }

        // 3. check product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(
                apiError({ status: 404, message: "Product not found" })
            );
        }

        // 4. validate fields
        const productNameRegex = /^[a-zA-Z0-9\s]+$/;
        const productDescriptionRegex = /^[a-zA-Z0-9-.,\s]+$/;
        const allowedStatus = ["published", "draft"];

        if (!productNameRegex.test(productName)) {
            return res.status(400).json(
                apiError({ status: 400, message: "Product name format is wrong" })
            );
        }

        if (isNaN(productPrice) || Number(productPrice) <= 0) {
            return res.status(400).json(
                apiError({ status: 400, message: "Product price must be a valid number" })
            );
        }

        if (!productDescriptionRegex.test(productDescription)) {
            return res.status(400).json(
                apiError({ status: 400, message: "Product description format is wrong" })
            );
        }

        if (productStatus && !allowedStatus.includes(productStatus)) {
            return res.status(400).json(
                apiError({ status: 400, message: "Invalid product status" })
            );
        }

        // 5. upload images ONLY if provided
        let productImagesArray = product.productImages;

        if (req.files && req.files.length > 0) {
            productImagesArray = [];
            for (const file of req.files) {
                const image = await cloudinary.uploader.upload(file.path);
                productImagesArray.push(image.secure_url);
                fs.unlinkSync(file.path);
            }
        }

        // 6. update product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    productName,
                    productPrice,
                    productDescription,
                    productImages: productImagesArray,
                    productCategory,
                    slug: productName.toLowerCase().replace(/\s+/g, "-"),
                    productStatus: productStatus || product.productStatus
                }
            },
            { new: true, runValidators: true }
        ).populate("productCategory");

        // 7. response
        return res.status(200).json(
            apiResponse({
                status: 200,
                message: "Product updated successfully",
                data: updatedProduct
            })
        );

    } catch (error) {
        console.log("Error in editing product - ", error);
        return res.status(500).json(
            apiError({ status: 500, message: "Cannot edit product" })
        );
    }
};

export const singleProductView = async (req, res) => {
    try {

        /*
        1. get id from params
        2. find product by id
        */

        // get id from params 
        const { id } = req.params;

        // find product by id
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json(
                apiError({ message: "Product not found" })
            );
        }

        // 2. send data to frontend
        return res.status(200).json(apiResponse({ status: 200, message: "All products fetched", data: product }))

    } catch (error) {
        return res.status(500).json(apiError({ message: "Cannot fetched all products", error: error }));
    }
}
