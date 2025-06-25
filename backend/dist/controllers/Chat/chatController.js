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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessages = exports.createMessage = void 0;
const chatServices_1 = require("../../services/Chat/chatServices");
// ────────────── Messages ──────────────
const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saved = yield (0, chatServices_1.saveMessage)(req.body);
        res.status(201).json(saved);
    }
    catch (err) {
        next(err);
    }
});
exports.createMessage = createMessage;
const fetchMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const messages = yield (0, chatServices_1.getMessagesByChatId)(chatId);
        res.status(200).json(messages);
    }
    catch (err) {
        next(err);
    }
});
exports.fetchMessages = fetchMessages;
