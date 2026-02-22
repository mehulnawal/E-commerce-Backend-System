import axiosCategory from "../../api/axiosCategory";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const viewAllCategory = createAsyncThunk('admin/ViewAllCategory', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosCategory.get('/viewAllCategories');
        return response.data.data;

    } catch (error) {
        console.log(error);
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

export const addNewCategory = createAsyncThunk('admin/addNewCategory', async (categoryName, { rejectWithValue }) => {
    try {

        const categoryDetails = {
            categoryName
        }

        const response = await axiosCategory.post('/addNewCategory', categoryDetails);
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

export const editNewCategory = createAsyncThunk('admin/editNewCategory', async (NewCategoryInformation, { rejectWithValue }) => {
    try {

        const categoryDetails = {
            "categoryId": NewCategoryInformation.categoryId,
            "categoryNewName": NewCategoryInformation.categoryNewName
        }

        console.log("id", NewCategoryInformation.categoryId)
        console.log("newName", NewCategoryInformation.categoryNewName)

        const response = await axiosCategory.post('/editCategory', categoryDetails);
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

export const statusToggleCategory = createAsyncThunk('admin/statusToggleCategory', async (subDetails, { rejectWithValue }) => {
    try {

        const details = {
            "categoryId": subDetails.categoryId,
            "categoryStatus": subDetails.categoryStatus,
        }

        console.log(details);

        const response = await axiosCategory.post('/toggleStatusOfCategory', details);
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

const categorySlice = createSlice({
    name: 'categorySlice',
    initialState: {
        loading: false,
        error: null,
        category: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(viewAllCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(viewAllCategory.fulfilled, (state, action) => {
                state.category = action.payload;
                state.loading = false
            })

            .addCase(viewAllCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(addNewCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(addNewCategory.fulfilled, (state, action) => {
                state.category.push(action.payload.data);
                state.loading = false
            })

            .addCase(addNewCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(editNewCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(editNewCategory.fulfilled, (state, action) => {
                const newData = action.payload.data;
                state.category = state.category.map(v => (
                    v._id == newData._id
                        ? v.categoryName = newData.categoryName
                        : v
                ));
                state.loading = false
            })

            .addCase(editNewCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        builder
            .addCase(statusToggleCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(statusToggleCategory.fulfilled, (state, action) => {
                const newData = action.payload.data;
                state.category = state.category.map(v => (
                    v._id == newData._id
                        ? v.status = newData.status
                        : v
                ));

                state.loading = false
            })

            .addCase(statusToggleCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default categorySlice.reducer;