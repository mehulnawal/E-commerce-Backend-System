import { productAxios } from "../../api/axiosProduct.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllTrashProducts = createAsyncThunk('product/trashProducts', async (_, { rejectWithValue }) => {

    try {
        const response = await productAxios.get('/showDraftProducts');
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

export const restoreProduct = createAsyncThunk('products/restoreProducts', async (productId, { rejectWithValue }) => {

    try {
        const response = await productAxios.post('/restoreDraftProducts', { productId });
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

const trashSlice = createSlice({
    name: 'trashSlice',
    initialState: {
        loading: false,
        error: null,
        trashProduct: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTrashProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(getAllTrashProducts.fulfilled, (state, action) => {
                state.trashProduct = action.payload.data
                state.loading = false
            })

            .addCase(getAllTrashProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })

        builder
            .addCase(restoreProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(restoreProduct.fulfilled, (state, action) => {
                const restoredId = action.payload.data._id;
                state.trashProduct = state.trashProduct.filter(
                    p => p._id !== restoredId
                );
                state.loading = false;
            })

            .addCase(restoreProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default trashSlice.reducer;