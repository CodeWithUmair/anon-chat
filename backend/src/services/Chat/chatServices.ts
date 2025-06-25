import Message from '../../models/chatModels';
import { CreateMessageDTO } from './DTO';

export const saveMessage = async (data: CreateMessageDTO) => {
    const message = new Message(data);
    return await message.save();
};

export const getMessagesByChatId = async (chatId: string) => {
    return await Message.find({ chatId }).sort({ timestamp: 1 });
};
