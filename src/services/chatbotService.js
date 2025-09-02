import openai from "../config/openai_config.js";

class ChatbotService {
    responseMessage = async (user_message) => {
        try {
            if (!user_message || user_message.trim() === "") {
                return {
                    success: false,
                    message: "Vui lòng nhập câu hỏi trước khi gửi"
                }
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Bạn là một trợ lý bất động sản thông minh. Trả lời tất cả các câu hỏi liên quan đến lĩnh vực bất động sản bằng tiếng Việt"
                    },
                    {
                        role: "user",
                        content: user_message
                    }
                ]
            });

            console.log("price token: ",response.usage);

            return {
                success: true,
                message: response.choices[0].message.content,
                token: response.usage
            }
        }
        catch (err) {
            console.error("Chatbot Serive error: ", err);
            return {
                success: false,
                message: "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau."
            }
        }
    }
}

export default new ChatbotService();