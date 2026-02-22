import { axiosUsers } from "../../api/axiosUsers.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllUsers = createAsyncThunk('users/getAllUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosUsers.get('getAllUsers');
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

export const getAllAdmin = createAsyncThunk('users/getAllAdmin', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosUsers.get('getAllAdmin');
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

export const filteredUsersFun = createAsyncThunk('users/filteredUsers', async (filterOptions, { rejectWithValue }) => {
    try {

        const response = await axiosUsers.post('/filterUsers', filterOptions);
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

console.log(
    "FINAL URL:",
    `${axiosUsers.defaults.baseURL}filteredUsersFun`
);

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        loading: false,
        error: null,
        allUsers: [],
        filteredUsers: [],
        allAdmin: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload.data
                state.filteredUsers = action.payload.data
                state.loading = false
            })

            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

        builder
            .addCase(filteredUsersFun.pending, (state) => {
                state.loading = false
                state.error = null
            })

            .addCase(filteredUsersFun.fulfilled, (state, action) => {
                const usersData = action.payload.data;
                // state.filteredUsers = state.allUsers.map(v => {
                //     if (v._id == usersData._id) {

                //     }
                // })

                state.filteredUsers = usersData;

                state.loading = false
            })

            .addCase(filteredUsersFun.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

        builder
            .addCase(getAllAdmin.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(getAllAdmin.fulfilled, (state, action) => {
                state.allAdmin = action.payload.data
                state.loading = false
            })

            .addCase(getAllAdmin.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

    }
})

export default userSlice.reducer;