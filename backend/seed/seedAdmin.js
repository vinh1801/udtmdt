import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const username = "admin";
    const password = "123456";
    const name = "Vinh";

    let user = await User.findOne({ username });
    if (user) {
      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
      console.log("Admin user already exists:", user.username);
    } else {
      const hash = await bcrypt.hash(password, 10);
      user = await User.create({
        username,
        name,
        password: hash,
        role: "admin",
        email: "admin@gmail.com"
      });
      console.log("Admin user created:", user.username);
    }
  } catch (e) {
    console.error("Seed admin error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();