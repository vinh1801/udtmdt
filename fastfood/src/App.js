import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

// 🧩 Import các component
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

// 🎨 CSS tổng
import "../src/styles/luxury.css";

// ⚙️ Layout chung cho toàn bộ trang
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>{children}</div>
      <Footer />
    </>
  );
}

// 🚀 Khai báo router
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

// 🧠 App chính
export default function App() {
  return <RouterProvider router={router} />;
}
