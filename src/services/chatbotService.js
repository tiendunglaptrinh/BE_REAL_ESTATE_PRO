import openai from "../config/openai_config.js";
import slugify from './../utils/slugify.js';
import Post from "../models/PostModel.js";

class ChatbotService {
    responseMessageWithPosts = async (user_message) => {
        try {
            if (!user_message || user_message.trim() === "") {
                return { success: false, message: "Vui lòng nhập câu hỏi trước khi gửi" };
            }

            // Lấy max 100 post published
            const posts = await Post.find({ status: "published" }).limit(100);

            // Build post list string
            const postList = posts
                .map(
                    (p) =>
                        `- Title: ${p.title}, Address: ${p.address}, Acreage: ${p.acreage} m2, Price: ${p.price}, URL: post/${slugify(p.title)}`
                )
                .join("\n");

            const systemPrompt = `Bạn là một trợ lý bất động sản thông minh. 
Trả lời tất cả các câu hỏi bằng tiếng Việt.
Ngoài ra bạn có thể tìm kiếm post hợp lệ từ câu hỏi người dùng để tìm ra post phù hợp. 
Các post hiện có:
${postList}
Hãy chọn post phù hợp nhất với câu hỏi người dùng: "${user_message}". 

Nếu bạn tìm được đáp án, hãy hiển thị với format như sau cho mỗi bài đăng:
Tôi đã tìm được x bài đăng phù hợp với nhu cầu của bạn, tham khảo dưới đây.

Bài đăng {số thứ tự}
title: {title}
acreage: {diện tích chỉ ghi số + đơn vị, ví dụ "20 m2"}
price: {giá chỉ ghi số + đơn vị, ví dụ "3 triệu"}
url: {đường dẫn, ví dụ "/post/..."}
 
Nếu không tìm thấy bài đăng nào thì trả lời "Không tìm thấy" và xin lỗi người dùng.`;


            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: user_message }
                ],
            });

            return {
                success: true,
                message: response.choices[0].message.content,
                token: response.usage
            };
        } catch (err) {
            console.error("Chatbot Service error:", err);
            return { success: false, message: "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau." };
        }
    };

    generateEmbedding = async (embeddingText) => {
        if (!embeddingText || embeddingText.trim() === "") {
            throw new Error("Embedding text không được để trống");
        }

        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small", // model rẻ, free tier
                input: embeddingText
            });

            const vector = response.data[0].embedding;
            return {
                success: true,
                data: vector
            }
        } catch (err) {
            console.error("Lỗi khi tạo embedding:", err);
            return {
                success: false,
                message: "Lỗi không tạo được vector embedding cho text"
            }
        }
    }
}

export default new ChatbotService();