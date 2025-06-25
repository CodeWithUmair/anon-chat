// src/controllers/Chat/chatRoomController.ts
import { Request, Response } from 'express';
import ChatRoom from '../../models/chatRoom';

export const createChatRoom = async (req: Request, res: Response) => {
    try {
        const {
            id,
            title,
            category,
            activeUsers = 1,
            lastMessage = new Date(),
            messageCount = 0,
        } = req.body;

        if (!id || !title || !category) {
            return res.status(400).json({ message: 'Missing required fields: id, title, or category' });
        }

        const existing = await ChatRoom.findOne({ title: new RegExp(`^${title}$`, 'i') });
        if (existing) {
            return res.status(400).json({ message: 'Chat room with this title already exists.' });
        }

        const newRoom = new ChatRoom({
            id,
            title,
            category,
            activeUsers,
            lastMessage,
            messageCount,
        });

        await newRoom.save();
        return res.status(201).json(newRoom);
    } catch (error) {
        console.error('❌ Error creating chat room:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllChatRooms = async (_req: Request, res: Response) => {
    try {
        const chatRooms = await ChatRoom.find().sort({ lastMessage: -1 }); // newest first
        return res.status(200).json(chatRooms);
    } catch (error) {
        console.error('❌ Error fetching chat rooms:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};