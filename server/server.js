import express from 'express';
import dotenv from 'dotenv';
import { apiError } from './src/utils/apiError.js';
import cors from 'cors';
import { connectDB } from './src/db/dbConfig.js';
import authRouter from './src/routes/auth.route.js';
import cookieParser from 'cookie-parser';
import productRouter from './src/routes/product.route.js';
import categoryRouter from './src/routes/category.route.js';
import { authenticateUser } from './src/middleware/authenticate.middleware.js';
import { checkRole } from './src/middleware/roleBasedAccess.middleware.js';
import subCategoryRouter from './src/routes/subCategory.route.js';
import userRouter from './src/routes/user.route.js';
import clientProductRouter from './src/routes/client/clientProduct.route.js';
import cartRouter from './src/routes/client/clientCart.route.js';
dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(cookieParser());

// connect db
connectDB();

// Routes 

// auth
app.use('/api/v1/users/auth/', authRouter);

// products
app.use('/api/v1/admin/products/', authenticateUser, checkRole('admin'), productRouter);

// categories
app.use('/api/v1/admin/category/', authenticateUser, checkRole('admin'), categoryRouter);

app.use('/api/v1/admin/subCategory/', authenticateUser, checkRole('admin'), subCategoryRouter);

// users
app.use('/api/v1/users/', authenticateUser, checkRole('admin'), userRouter);

// client products
app.use('/api/v1/client/products/', authenticateUser, checkRole('user', "admin"), clientProductRouter);

// client cart 
app.use('/api/v1/cart/', authenticateUser, checkRole('user', "admin"), cartRouter);

// start server
const PORT = process.env.PORT || 9000

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error("Port already in use");
    } else {
        console.error("Server error:", error.message);
    }
    process.exit(1);
})