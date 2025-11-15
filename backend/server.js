import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import categoryAdminRoutes from "./routes/admin/categoryAdminRoutes.js";
import foodAdminRoutes from "./routes/admin/foodAdminRoutes.js";
import orderAdminRoutes from "./routes/admin/orderAdminRoutes.js";
import userAdminRoutes from "./routes/admin/userAdminRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (_req, res) => res.send("FASTFOOD API OK"));
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", categoryAdminRoutes);
app.use("/api/admin/foods", foodAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/admin/users", userAdminRoutes);


const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 API running on http://localhost:${PORT}`)
    );
  })
  .catch((e) => console.error("❌ Mongo connect error:", e));