import { productAxios } from "../../api/axiosProduct.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const showAllProducts = createAsyncThunk('products/showALlProducts', async (_, { rejectWithValue }) => {
    try {
        const response = await productAxios.get('/showAllProducts');
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

export const addNewProducts = createAsyncThunk('products/addNewProducts', async (productDetails, { rejectWithValue }) => {

    try {

        const formData = new FormData();

        formData.append("productName", productDetails.productName);
        formData.append("productPrice", productDetails.productPrice);
        formData.append("productDescription", productDetails.productDescription);
        formData.append("productCategory", productDetails.productCategory);
        formData.append("productStatus", productDetails.productStatus);

        Object.values(productDetails.productImages).forEach((file) => {
            formData.append("productImages", file);
        });

        const response = await productAxios.post('/addNewProduct', formData);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
    try {

        const response = await productAxios.delete(`/deleteProduct/${productId}`);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

export const editProducts = createAsyncThunk('products/editProducts', async (productDetails, { rejectWithValue }) => {

    try {

        const formData = new FormData();

        formData.append("productId", productDetails.productId);
        formData.append("productName", productDetails.productName);
        formData.append("productPrice", productDetails.productPrice);
        formData.append("productDescription", productDetails.productDescription);
        formData.append("productCategory", productDetails.productCategory);
        formData.append("productStatus", productDetails.productStatus);

        Object.values(productDetails.productImages).forEach((file) => {
            formData.append("productImages", file);
        });

        const response = await productAxios.put('/editProducts', formData);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

const productSlice = createSlice({
    name: 'productSlice',
    initialState: {
        loading: false,
        error: null,
        products: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(showAllProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(showAllProducts.fulfilled, (state, action) => {
                // console.log(action.payload.data);
                state.products = action.payload.data
                state.loading = false
            })

            .addCase(showAllProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })

        builder
            .addCase(addNewProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(addNewProducts.fulfilled, (state, action) => {
                state.products.push(action.payload.data);
                state.loading = false
            })

            .addCase(addNewProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })

        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                const updatedProduct = action.payload.data;
                state.products = state.products.filter(v => v._id !== updatedProduct._id);
                state.loading = false
            })

            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })

        builder
            .addCase(editProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(editProducts.fulfilled, (state, action) => {
                const product = action.payload.data;
                state.products = state.products.map(v =>
                    v._id === product._id ? product : v
                );
                state.loading = false
            })

            .addCase(editProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
    }
})

export default productSlice.reducer;