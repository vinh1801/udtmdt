import dotenv from "dotenv";
import mongoose from "mongoose";
import Food from "../models/Food.js";

dotenv.config();

const foods = [
  { name: "Burger Bò Phô Mai", price: 50000, category: "Burger", image: "/img/burger-cheese.jpg", description: "Bò nướng + phô mai tan chảy" },
  { name: "Burger Gà Giòn", price: 45000, category: "Burger", image: "/img/burger-chicken.jpg", description: "Gà giòn rụm, sốt cay nhẹ" },
  { name: "Khoai Tây Chiên", price: 30000, category: "Side", image: "/img/fries.jpg", description: "Giòn ngoài mềm trong" },
  { name: "Gà Rán 2 Miếng", price: 60000, category: "Chicken", image: "/img/fried-chicken.jpg", description: "Gà rán công thức đặc biệt" },
  { name: "Cơm Gà Sốt Cay", price: 55000, category: "Rice", image: "/img/spicy-chicken-rice.jpg", description: "Cơm + gà sốt cay" },
  { name: "Mì Ý Bò Bằm", price: 65000, category: "Pasta", image: "/img/spaghetti.jpg", description: "Mì Ý sốt bò bằm" },
  { name: "Pepsi", price: 20000, category: "Drink", image: "/img/pepsi.jpg", description: "Uống là mát đã" },
  { name: "7Up", price: 20000, category: "Drink", image: "/img/7up.jpg", description: "Thanh mát" },
  { name: "Trà Đào Cam Sả", price: 35000, category: "Drink", image: "/img/peach-tea.jpg", description: "Thơm mùi đào" },
  { name: "Salad Rau Trộn", price: 40000, category: "Side", image: "/img/salad.jpg", description: "Healthy nhẹ nhàng" },
  { name: "Combo Burger + Khoai + Nước", price: 90000, category: "Combo", image: "/img/combo1.jpg", description: "Tiết kiệm 15%" },
  { name: "Cánh Gà Sốt BBQ", price: 65000, category: "Chicken", image: "/img/bbq-wings.jpg", description: "BBQ đậm đà" }
];

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    await Food.deleteMany({});
    await Food.insertMany(foods);
    console.log(`🍔 Seeded ${foods.length} foods.`);

    await mongoose.connection.close();
    console.log("🔌 Done.");
    process.exit(0);
  } catch (e) {
    console.error("🚨 Seed error:", e);
    process.exit(1);
  }
})();
