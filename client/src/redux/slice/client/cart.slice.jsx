import { ActivityIcon } from "lucide-react";
import cartAxios from "../../../api/axiosCart.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Get all cart items
export const getAllCartItemsFun = createAsyncThunk('cart/getAllCartItems', async (_, { rejectWithValue }) => {
    try {

        const response = await cartAxios.get('getAllCartItems');
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error.response?.data?.message
            return rejectWithValue(message)
        }
        else {
            const message = error.response?.data?.message
            return rejectWithValue(message)
        }
    }
})

// Add to cart
export const addToCartFun = createAsyncThunk('cart/addToCart', async (productDetails, { rejectWithValue }) => {
    try {

        console.log(productDetails);

        const response = await cartAxios.post('addToCart', productDetails);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error.response?.data?.message
            return rejectWithValue(message)
        }
        else {
            const message = error.response?.data?.message
            return rejectWithValue(message)
        }
    }
})

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: {
        loading: false,
        error: null,
        cart: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCartItemsFun.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(getAllCartItemsFun.fulfilled, (state, action) => {
                state.cart = action.payload.data;
                state.loading = false
            })

            .addCase(getAllCartItemsFun.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // ADD TO CART
            .addCase(addToCartFun.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(addToCartFun.fulfilled, (state, action) => {
                state.loading = false;
                state.cart.push(action.payload.data);
            })

            .addCase(addToCartFun.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default cartSlice.reducer;