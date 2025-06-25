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
exports.getMessagesByChatId = exports.saveMessage = void 0;
const chatModels_1 = __importDefault(require("../../models/chatModels"));
const saveMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const message = new chatModels_1.default(data);
    return yield message.save();
});
exports.saveMessage = saveMessage;
const getMessagesByChatId = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chatModels_1.default.find({ chatId }).sort({ timestamp: 1 });
});
exports.getMessagesByChatId = getMessagesByChatId;
