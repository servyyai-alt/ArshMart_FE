import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import WhatsAppCart from "./pages/WhatsAppCart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Returns from "./pages/Returns.jsx";
import ReturnDetail from "./pages/ReturnDetail.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Terms from "./pages/Policies/Terms.jsx";
import Privacy from "./pages/Policies/Privacy.jsx";
import Shipping from "./pages/Policies/Shipping.jsx";
import Refunds from "./pages/Policies/Refunds.jsx";
import Contact from "./pages/Policies/Contact.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Admin Pages
import DashboardHome from "./pages/AdminDashboard/DashboardHome.jsx";
import AdminProducts from "./pages/AdminDashboard/Products.jsx";
import AdminCategories from "./pages/AdminDashboard/Categories.jsx";
import AdminOrders from "./pages/AdminDashboard/Orders.jsx";
import AdminReturns from "./pages/AdminDashboard/Returns.jsx";
import AdminUsers from "./pages/AdminDashboard/Users.jsx";
import AdminGallery from "./pages/AdminDashboard/Gallery.jsx";
import AdminSettings from "./pages/AdminDashboard/Settings.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingSocials from "./components/FloatingSocials.jsx";

// Redux
import { loadUser } from "./redux/slices/authSlice.js";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
};

// Layout for public pages
const PublicLayout = ({ children }) => (
  <div
    className="min-h-screen flex flex-col "
     style={{
    background: "linear-gradient(to bottom, #5bb253 0%, #ffffff 20%, #ffffff 100%)",
    minHeight: "100vh"
  }}
  >
    <Navbar />
    <main className="flex-1">{children}</main>
    <FloatingSocials />
    <Footer />
  </div>
);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(30,41,59,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f8fafc",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/products"
          element={
            <PublicLayout>
              <ProductList />
            </PublicLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PublicLayout>
              <ProductDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <PublicLayout>
              <Cart />
            </PublicLayout>
          }
        />
        <Route
          path="/whatsapp-cart"
          element={
            <PublicLayout>
              <WhatsAppCart />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Checkout />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Profile />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Orders />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <OrderDetail />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Returns />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns/:id"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <ReturnDetail />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:id"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <OrderSuccess />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <PublicLayout>
                <Wishlist />
              </PublicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicLayout>
              <Terms />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <Privacy />
            </PublicLayout>
          }
        />
        <Route
          path="/shipping"
          element={
            <PublicLayout>
              <Shipping />
            </PublicLayout>
          }
        />
        <Route
          path="/refunds"
          element={
            <PublicLayout>
              <Refunds />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardHome />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/returns"
          element={
            <AdminRoute>
              <AdminReturns />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <AdminRoute>
              <AdminGallery />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
