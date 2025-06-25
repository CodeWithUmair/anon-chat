// src/routes/Chat/chatRoutes.ts
import express from 'express';
import { createMessage, fetchMessages } from '../../controllers/Chat/chatController';
import { createChatRoom, getAllChatRooms } from '../../controllers/Chat/chatRoomController'; // ✅ import fixed

const router = express.Router();

router.post('/message', createMessage);
router.get('/:chatId/messages', fetchMessages);

router.post('/room', (req, res, next) => {
    createChatRoom(req, res).catch(next);
});
router.get('/rooms', (req, res, next) => {
    getAllChatRooms(req, res).catch(next);
});

export default router;
