"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/Chat/chatRoutes.ts
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../../controllers/Chat/chatController");
const chatRoomController_1 = require("../../controllers/Chat/chatRoomController"); // ✅ import fixed
const router = express_1.default.Router();
router.post('/message', chatController_1.createMessage);
router.get('/:chatId/messages', chatController_1.fetchMessages);
router.post('/room', (req, res, next) => {
    (0, chatRoomController_1.createChatRoom)(req, res).catch(next);
});
router.get('/rooms', (req, res, next) => {
    (0, chatRoomController_1.getAllChatRooms)(req, res).catch(next);
});
exports.default = router;
