import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import HomePage from "../pages/HomePage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import FarmingTipsPage from "../pages/FarmingTipsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import FarmerDashboard from "../pages/FarmerDashboard";
import AddProductPage from "../pages/AddProductPage";
import ManageOrdersPage from "../pages/ManageOrdersPage";
import AdminDashboard from "../pages/AdminDashboard";
import ManageUsersPage from "../pages/ManageUsersPage";
import ManageProductsPage from "../pages/ManageProductsPage";
import ManageOrdersAdmin from "../pages/ManageOrdersAdmin";
import ManageTipsPage from "../pages/ManageTipsPage";
import BuyerDashboard from "../pages/BuyerDashboard";

// ✅ Newly Added Imports
import BuyerProducts from "../pages/BuyerProducts";
import BuyerOrders from "../pages/BuyerOrders";
import LeaveReview from "../pages/LeaveReview";

// ✅ Admin Orders Import
import AdminOrders from "../pages/AdminOrders";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ✅ Protected Route Component (Updated)
const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Get role from context or localStorage (Fixes login persistence issue)
    useEffect(() => {
        if (user) {
            setUserRole(user.role);  // If user is logged in, update the role
        } else {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserRole(parsedUser.role);  // Use the stored user's role
            }
        }
        setLoading(false);  // Set loading to false after checking role
    }, [user]);  // Rerun effect when user changes

    // Debugging
    console.log("🔍 ProtectedRoute - Current User Role:", userRole);
    console.log("🔍 Allowed Roles:", allowedRoles);

    if (loading) {
        console.log("⏳ Checking user role...");
        return <p>Loading...</p>;
    }

    if (!userRole) {
        console.log("❌ User not logged in - Redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        console.log(`🚫 Unauthorized! User Role: ${userRole}, Required: ${allowedRoles}`);
        return <Navigate to="/" replace />;
    }

    console.log("✅ User authorized - Rendering component");
    return element;
};


const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/farming-tips" element={<FarmingTipsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* ✅ Buyer Routes - Protected */}
                <Route 
                    path="/buyer/dashboard" 
                    element={<ProtectedRoute element={<BuyerDashboard />} allowedRoles={["buyer"]} />} 
                />
                <Route 
                    path="/buyer/products" 
                    element={<ProtectedRoute element={<BuyerProducts />} allowedRoles={["buyer"]} />} 
                />
                <Route 
                    path="/buyer/orders" 
                    element={<ProtectedRoute element={<BuyerOrders />} allowedRoles={["buyer"]} />} 
                />
                <Route 
                    path="/buyer/review" 
                    element={<ProtectedRoute element={<LeaveReview />} allowedRoles={["buyer"]} />} 
                />

                {/* ✅ Farmer Routes - Protected */}
                <Route 
                    path="/farmer/dashboard" 
                    element={<ProtectedRoute element={<FarmerDashboard />} allowedRoles={["farmer"]} />} 
                />
                <Route 
                    path="/farmer/add-product" 
                    element={<ProtectedRoute element={<AddProductPage />} allowedRoles={["farmer"]} />} 
                />
                <Route 
                    path="/farmer/manage-orders" 
                    element={<ProtectedRoute element={<ManageOrdersPage />} allowedRoles={["farmer"]} />} 
                />

                {/* ✅ Admin Routes - Protected */}
                <Route 
                    path="/admin/dashboard" 
                    element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />} 
                />
                <Route 
                    path="/admin/manage-users" 
                    element={<ProtectedRoute element={<ManageUsersPage />} allowedRoles={["admin"]} />} 
                />
                <Route 
                    path="/admin/manage-products" 
                    element={<ProtectedRoute element={<ManageProductsPage />} allowedRoles={["admin"]} />} 
                />
                <Route 
                    path="/admin/manage-orders" 
                    element={<ProtectedRoute element={<ManageOrdersAdmin />} allowedRoles={["admin"]} />} 
                />
                <Route 
                    path="/admin/manage-tips" 
                    element={<ProtectedRoute element={<ManageTipsPage />} allowedRoles={["admin"]} />} 
                />

                {/* ✅ Admin Orders Route */}
                <Route 
                    path="/admin/orders" 
                    element={<ProtectedRoute element={<AdminOrders />} allowedRoles={["admin"]} />} 
                />
            </Routes>
            <Footer />
        </Router>
    );
};

export default AppRoutes;
