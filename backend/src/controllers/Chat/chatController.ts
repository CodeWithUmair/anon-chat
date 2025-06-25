import { Request, Response, NextFunction } from 'express';
import { saveMessage, getMessagesByChatId } from '../../services/Chat/chatServices';

// ────────────── Messages ──────────────

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saved = await saveMessage(req.body);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

export const fetchMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;
        const messages = await getMessagesByChatId(chatId);
        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
};
