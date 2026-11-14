/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget.tsx';
import { BlackFridayModal } from './components/common/BlackFridayModal.tsx';

// Public pages
import { Home } from './pages/Home.tsx';
import { About } from './pages/About.tsx';
import { Policy } from './pages/Policy.tsx';
import { FAQ } from './pages/FAQ.tsx';

// Auth pages
import { Login } from './pages/auth/Login.tsx';
import { Register } from './pages/auth/Register.tsx';
import { ForgotPassword } from './pages/auth/ForgotPassword.tsx';
import { ResetPassword } from './pages/auth/ResetPassword.tsx';

// Protected Customer pages
import { Products } from './pages/Products.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { Cart } from './pages/Cart.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { OrderSuccess } from './pages/OrderSuccess.tsx';
import { Search } from './pages/Search.tsx';
import { Account } from './pages/Account.tsx';
import { Admin } from './pages/Admin.tsx';
import { Blog } from './pages/Blog.tsx';
import { BlogDetail } from './pages/BlogDetail.tsx';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#FFF9FA] text-[#2D2226] antialiased selection:bg-rose-100 selection:text-rose-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Public Storefront Routes - Open to guests and members alike */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/order-success/:code" element={<OrderSuccess />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />

                {/* Dedicated In-Store Admin Dashboard - Protected with requireAdmin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <ChatbotWidget />
            <BlackFridayModal />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
