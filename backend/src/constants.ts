// src/constants.ts
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env variables immediately

export const IS_TEST_MODE = true;

export const PORT = process.env.PORT || "5000";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in your environment variables");
}
