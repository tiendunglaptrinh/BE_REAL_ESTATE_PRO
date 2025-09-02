import ChatBotService from "../services/chatbotService.js";

class MessageController {
    sendMessageToChatBot = async (req, res) => {
        const { userId } = req.user;
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(422).json({
                success: false,
                message: "Tin nhắn không được để trống."
            });
        }

        try {
            const response = await ChatBotService.responseMessage(message);

            if (response.success) {
                return res.status(200).json({
                    success: true,
                    message: response.message
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: response.message
                });
            }
        } catch (err) {
            console.error("sendMessageToChatBot error:", err);
            return res.status(500).json({
                success: false,
                message: "Xin lỗi, hiện tại không thể gửi tin nhắn. Vui lòng thử lại sau."
            });
        }
    }

    getMessageConversation = async (req, res) => {
        // You can implement this later to fetch messages for a conversation
    }
}

export default new MessageController();
