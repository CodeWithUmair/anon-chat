import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import { PORT } from "./constants";
import errorHandler from "./middlewares/errorHandler";
import chatRoutes from "./routes/Chat/chatRoutes";

//TODO:add frontedn url live
export const frontend_url = "https://anon-chat.vercel.app";
export const local_url = "http://localhost:5173";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: [
    frontend_url, // Latest URL for frontend
    local_url, // URL for local env
  ],
  // credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Adjust Helmet settings
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin resources
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan("dev"));

// Database Connection
connectDB();

// Routes
app.use("/api/v1/chat", chatRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

app.get("/", (_, res) => {
  res.status(200);
  console.log("🚀 ~ app.get ~ Backend is running fine here:");
  res.send("Backend is running fine here ............");
});

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
export default app;
