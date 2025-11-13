// Bootstrap + React core
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

// Global styles
import "./index.css";
import "./styles/custom.css";
import "./styles/luxury.css";
import "aos/dist/aos.css";

// Components
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Animation lib (AOS)
import AOS from "aos";

// Initialize animation
AOS.init({
  duration: 800,
  easing: "ease-in-out",
  once: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AdminAuthProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </AdminAuthProvider>
);

// Performance tracking (optional)
reportWebVitals();