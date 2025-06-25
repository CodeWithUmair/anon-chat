"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChatRooms = exports.createChatRoom = void 0;
const chatRoom_1 = __importDefault(require("../../models/chatRoom"));
const createChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, category, activeUsers = 1, lastMessage = new Date(), messageCount = 0, } = req.body;
        if (!id || !title || !category) {
            return res.status(400).json({ message: 'Missing required fields: id, title, or category' });
        }
        const existing = yield chatRoom_1.default.findOne({ title: new RegExp(`^${title}$`, 'i') });
        if (existing) {
            return res.status(400).json({ message: 'Chat room with this title already exists.' });
        }
        const newRoom = new chatRoom_1.default({
            id,
            title,
            category,
            activeUsers,
            lastMessage,
            messageCount,
        });
        yield newRoom.save();
        return res.status(201).json(newRoom);
    }
    catch (error) {
        console.error('❌ Error creating chat room:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createChatRoom = createChatRoom;
const getAllChatRooms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatRooms = yield chatRoom_1.default.find().sort({ lastMessage: -1 }); // newest first
        return res.status(200).json(chatRooms);
    }
    catch (error) {
        console.error('❌ Error fetching chat rooms:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllChatRooms = getAllChatRooms;
