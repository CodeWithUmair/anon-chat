// models/ChatRoom.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IChatRoom extends Document {
    id: string;
    title: string;
    category: string;
    activeUsers: number;
    lastMessage: Date;
    messageCount: number;
}

const chatRoomSchema = new Schema<IChatRoom>({
    id: { type: String, required: true, unique: true }, // same as frontend `generateId()`
    title: { type: String, required: true },
    category: { type: String, required: true },
    activeUsers: { type: Number, default: 1 },
    lastMessage: { type: Date, default: Date.now },
    messageCount: { type: Number, default: 0 }
});

export default mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
