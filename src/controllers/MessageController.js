import mongoose from 'mongoose';
import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import ChatbotService from "../services/chatbotService.js";
import formatContext from '../utils/formatContext.js';

class MessageController {
    sendMessageToChatBot = async (req, res) => {
        const { userId } = req.user;
        const { user_message } = req.body;

        if (!user_message?.trim()) {
            return res.status(422).json({
                success: false,
                message: "Tin nhắn không được để trống."
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Tìm hoặc tạo conversation
            let conversation = await Conversation.findOne({ user_id: userId }).session(session);
            if (!conversation) {
                [conversation] = await Conversation.create([{
                    user_id: userId,
                    last_message: user_message,
                    last_message_at: Date.now()
                }], { session });
            } else {
                conversation.last_message = user_message;
                conversation.last_message_at = Date.now();
                await conversation.save({ session });
            }

            // Lưu message user
            await Message.create([{
                user_id: userId,
                conversation_id: conversation._id,
                sender_role: "user",
                content: user_message
            }], { session });

            // Gọi bot service
            const response_from_bot = await ChatbotService.responseMessageWithPosts(user_message);
            let botMessageContent = response_from_bot.success
                ? response_from_bot.message
                : "Bot không trả lời được, vui lòng thử lại.";

            // Lưu message bot
            await Message.create([{
                user_id: userId,
                conversation_id: conversation._id,
                sender_role: "assistant",
                content: botMessageContent
            }], { session });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                success: true,
                bot_response: formatContext(botMessageContent)
            });
        } catch (err) {
            console.error("sendMessageToChatBot error:", err);
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                success: false,
                message: "Xin lỗi, không thể gửi tin nhắn. Vui lòng thử lại sau."
            });
        }
    };



    getMessageConversation = async (req, res) => {
        // You can implement this later to fetch messages for a conversation
    }
}

export default new MessageController();
