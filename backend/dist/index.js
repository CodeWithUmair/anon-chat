"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.local_url = exports.frontend_url = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const constants_1 = require("./constants");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const chatRoutes_1 = __importDefault(require("./routes/Chat/chatRoutes"));
//TODO:add frontedn url live
exports.frontend_url = "https://localhost:5173";
exports.local_url = "http://localhost:5173";
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
const corsOptions = {
    origin: [
        exports.frontend_url, // Latest URL for frontend
        exports.local_url, // URL for local env
    ],
    // credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
// Adjust Helmet settings
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false, // Allow cross-origin resources
    crossOriginEmbedderPolicy: false,
}));
app.use((0, morgan_1.default)("dev"));
// Database Connection
(0, db_1.default)();
// Routes
app.use("/api/v1/chat", chatRoutes_1.default);
// Global Error Handling Middleware
app.use(errorHandler_1.default);
app.get("/", (_, res) => {
    res.status(200);
    console.log("🚀 ~ app.get ~ Backend is running fine here:");
    res.send("Backend is running fine here ............");
});
const port = constants_1.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
exports.default = app;
