import Account from "../models/AccountModel.js";
import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";

class MessageService {
    checkHaveConversation = async (userId) => {
        try {
            const conversation = await Conversation.findOne({ userId : user_id });
            if (conversation) {
                return {
                    success: true,
                    data: conversation._id.toString()
                }
            }
        }
        catch {
            return {
                success: false,
                message: "Lỗi hệ thống"
            }
        }

    }

    createMessageforUser = async (message, user_id, conversation_id) => {
        try {
            const message = await Message.create({
                user_id,
                conversation_id,
                sender_role: "user",
                content: message
            });
        }
        catch (err) {
            return {
                success: false,
                message: "Lỗi hệ thống"
            }
        }

    }

    updateConversation = async () => {
        
    }
}

export default new MessageService();