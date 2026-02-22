import axiosSubCategory from "../../api/axiosSubCategory";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addNewSubCategory = createAsyncThunk('admin/addNewSubCategory', async (subCategoryDetails, { rejectWithValue }) => {
    try {

        console.log(subCategoryDetails);
        const response = await axiosSubCategory.post('/addNewSubCategory', subCategoryDetails);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else if (error) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

export const editNewSubCategory = createAsyncThunk('admin/editNewCategory', async (updatedDetails, { rejectWithValue }) => {
    try {


        const categoryDetails = {
            "subCategoryId": updatedDetails.subCategoryId,
            "subCategoryNewName": updatedDetails.subCategoryNewName,
            "parentId": updatedDetails.parentId,
        }

        const response = await axiosSubCategory.post('/editSubCategory', categoryDetails);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else if (error) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

export const statusToggleSubCategory = createAsyncThunk('admin/statusToggleSubCategory', async (subDetails, { rejectWithValue }) => {
    try {

        const details = {
            "subCategoryStatus": subDetails.subCategoryStatus,
            "subCategoryId": subDetails.subCategoryId,
        }

        const response = await axiosSubCategory.post('/toggleStatusSubCategory', details);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
        else if (error) {
            const message = error?.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

const subCategorySlice = createSlice({
    name: 'subCategorySlice',
    initialState: {
        loading: false,
        error: null,
        SubCategory: []
    },
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(addNewSubCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(addNewSubCategory.fulfilled, (state, action) => {
                state.SubCategory.push(action.payload);
                state.loading = false
            })

            .addCase(addNewSubCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(editNewSubCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(editNewSubCategory.fulfilled, (state, action) => {
                const newData = action.payload.data;
                state.SubCategory = state.SubCategory.map(v => (
                    v._id == newData._id
                        ? { ...v, subCategoryName: newData.subCategoryName, categoryId: newData.categoryId }
                        : v
                ));
                state.loading = false
            })

            .addCase(editNewSubCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(statusToggleSubCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(statusToggleSubCategory.fulfilled, (state, action) => {
                const newData = action.payload.data;
                state.SubCategory = state.SubCategory.map(v => (
                    v._id == newData._id
                        ? v.subStatus = newData.subStatus
                        : v
                ));
                state.loading = false
            })

            .addCase(statusToggleSubCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default subCategorySlice.reducer;