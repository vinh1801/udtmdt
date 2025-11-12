// Bootstrap + React core
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";

// Global styles
import "./index.css";
import "./styles/custom.css";
import "./styles/luxury.css"; // luxury theme riêng
import "aos/dist/aos.css"; // animation lib

// Components
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Animation lib (AOS)
import AOS from "aos";

// Initialize animation
AOS.init({
  duration: 800, // tốc độ animation (ms)
  easing: "ease-in-out", // kiểu di chuyển
  once: true, // chỉ chạy 1 lần khi cuộn
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// Performance tracking (optional)
reportWebVitals();
