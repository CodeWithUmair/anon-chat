"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URI = exports.NODE_ENV = exports.PORT = exports.IS_TEST_MODE = void 0;
// src/constants.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Load .env variables immediately
exports.IS_TEST_MODE = true;
exports.PORT = process.env.PORT || "5000";
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.MONGO_URI = process.env.MONGO_URI || "";
if (!exports.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in your environment variables");
}
