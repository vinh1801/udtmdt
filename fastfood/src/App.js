import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Specials from "./components/Specials";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import FoodDetail from "./components/FoodDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Payment from "./components/Payment";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderSuccess from "./components/OrderSuccess";
import AdminRoute from "./components/AdminRoute";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import "../src/styles/luxury.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>{children}</div>
      <Footer />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <Layout>
            <Hero />
            <Specials />
          </Layout>
        }
      />

      <Route
        path="/food/:id"
        element={
          <Layout>
            <FoodDetail />
          </Layout>
        }
      />

      <Route
        path="/menu"
        element={
          <Layout>
            <Menu />
          </Layout>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Layout>
              <Cart />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Layout>
              <Payment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderSuccess />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin login riêng */}
      <Route
        path="/admin/login"
        element={
          <Layout>
            <AdminLogin />
          </Layout>
        }
      />

      {/* Khu vực admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout>
              <Admin />
            </Layout>
          </AdminRoute>
        }
      />

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      <Route
        path="*"
        element={
          <Layout>
            <div
              style={{
                textAlign: "center",
                padding: "100px",
                color: "#ffd700",
                background: "linear-gradient(135deg, #1a0033, #3b0078)",
              }}
            >
              <h2>404 - Trang không tồn tại 😢</h2>
              <p>
                Vui lòng quay lại{" "}
                <a href="/" style={{ color: "#ff33cc" }}>
                  trang chủ
                </a>
                .
              </p>
            </div>
          </Layout>
        }
      />
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}