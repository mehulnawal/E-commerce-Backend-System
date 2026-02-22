import { axiosUsersProducts } from "../../../api/axiosUsers.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const clientGetAllProducts = createAsyncThunk('shop/allProducts', async (_, { rejectWithValue }) => {
    try {

        const response = await axiosUsersProducts.get('/getAllProducts');
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error.response?.data?.message
            return rejectWithValue(message);
        }
        else {
            const message = error.response?.data.message
            return rejectWithValue(message);
        }
    }
})

export const clientGetSingleProducts = createAsyncThunk('shop/singleProducts', async (id, { rejectWithValue }) => {
    try {
        const response = await axiosUsersProducts.get(`/singleProduct/${id}`);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error.response?.data?.message
            return rejectWithValue(message);
        }
        else {
            const message = error.response?.data.message
            return rejectWithValue(message);
        }
    }
})

const shopSlice = createSlice({
    name: 'shopSlice',
    initialState: {
        loading: false,
        error: null,
        products: [],
        singleProduct: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(clientGetAllProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(clientGetAllProducts.fulfilled, (state, action) => {
                state.products = action.payload
                state.loading = false
            })

            .addCase(clientGetAllProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(clientGetSingleProducts.pending, (state) => {
                state.loading = true
                state.error = null
                state.singleProduct = null
            })

            .addCase(clientGetSingleProducts.fulfilled, (state, action) => {
                state.singleProduct = action.payload
                state.loading = false
            })

            .addCase(clientGetSingleProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default shopSlice.reducer;