export interface CreateMessageDTO {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    chatId: string;
    timestamp?: Date;
}
