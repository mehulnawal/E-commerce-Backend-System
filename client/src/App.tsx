import { ErrorPage } from '././components/pages/error';
import AdminLayout from './admin/Layout/adminLayout';
import Admins from './admin/pages/admin';
import Categories from './admin/pages/categories';
import Dashboard from './admin/pages/dashboard';
import ProductForm from './admin/pages/productForm';
import Products from './admin/pages/products';
import Trash from './admin/pages/trash';
import Users from './admin/pages/users';
import ForgotPassword from './components/pages/forgetPassword';
import Login from './components/pages/login';
import Logout from './components/pages/logout';
import Register from './components/pages/register';
import ResetPassword from './components/pages/resetPassword';
import VerifyOTP from './components/pages/verifyOtp';
import Loader from './components/UI/loader';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClientLayout } from './components/pages/client/clientLayout';
import Home from './components/pages/client/home';
import Shop from './components/pages/client/shop';
import ProductDetails from './components/pages/client/prouctDetails';
import Cart from './components/pages/client/cart';
import Checkout from './components/pages/client/checkout';
import OrderTracking from './components/pages/client/orderTracking';
import UserDashboard from './components/pages/client/userDashboard';
import EditProfile from './components/pages/client/editProfile';
import { ProtectedRoute } from './components/protectedRoute';

const App = () => {

  return (
    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Define default premium styles here
          style: {
            background: '#333',
            color: '#fff',
          }
        }}
      />

      <Router>
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="*" element={<ErrorPage errorCode={404} />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/verify-user" element={<VerifyOTP />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/loader" element={<Loader />} />

          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="/client/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="productDetails/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="orderTracking" element={<OrderTracking />} />
            <Route path="editProfile" element={<EditProfile />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute >
                <AdminLayout />
              </ProtectedRoute>} >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="product/add" element={<ProductForm />} />
            <Route path="product/edit/:id" element={<ProductForm />} />
            <Route path="trash" element={<Trash />} />
            <Route path="users" element={<Users />} />
            <Route path="admins" element={<Admins />} />
          </Route>

        </Routes >



      </Router >
    </>
  );
};

export default App;