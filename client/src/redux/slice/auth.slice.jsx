import authAxios from "../../api/axiosAuth.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// login user
export const loginUser = createAsyncThunk('auth/login', async (userDetails, { rejectWithValue }) => {
    try {
        const response = await authAxios.post('/login', userDetails);
        return response.data;

    } catch (error) {
        if (error.response) {
            const message = error.response?.data?.message;
            return rejectWithValue(message);
        }
        else {
            const message = error.response?.data?.message;
            return rejectWithValue(message);
        }
    }
})

// register user
export const registerUser = createAsyncThunk('auth/register', async (userDetails, { rejectWithValue }) => {
    try {

        const formData = new FormData();
        formData.append('userName', userDetails.userName);
        formData.append('userEmail', userDetails.userEmail);
        formData.append('userPassword', userDetails.userPassword);
        formData.append('userNumber', userDetails.userNumber);
        formData.append('userProfileImage', userDetails.userProfileImage);

        const response = await authAxios.post('/register', formData);
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

// forget password
export const forgetPassword = createAsyncThunk('auth/forgetPassword', async (userEmail, { rejectWithValue }) => {
    try {
        const response = await authAxios.post('/forgetPassword', { userEmail });
        console.log(response.data.data)
        return response.data.data;

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

// reset password
export const resetPassword = createAsyncThunk('auth/resetPassword', async (userDetails, { rejectWithValue }) => {
    try {

        const response = await authAxios.post('/resetPassword', userDetails);
        console.log(response.data.data);
        return response.data.data;

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

// logout 
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {

        const response = await authAxios.get('/logout');
        console.log(response.data.data);
        return response.data.data;

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

// reset refresh token

// verify user 

// verify user otp

const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        loading: false,
        error: null,
        user: null,
        userEmail: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

        builder
            .addCase(forgetPassword.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.userEmail = action.payload
                state.loading = false
            })

            .addCase(forgetPassword.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(resetPassword.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })

            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

        builder
            .addCase(logout.pending, (state) => {
                state.loading = true
                state.error = null
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.userEmail = null
                state.loading = false
            })

            .addCase(logout.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    }
})

export default authSlice.reducer;