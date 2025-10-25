import openai from "../config/openai_config.js";
import slugify from './../utils/slugify.js';
import Post from "../models/PostModel.js";

class ChatbotService {
    responseMessageWithPosts = async (user_message) => {
        try {
            if (!user_message || user_message.trim() === "") {
                return { success: false, message: "Vui lòng nhập câu hỏi trước khi gửi" };
            }

            // Hàm check câu hỏi có liên quan BĐS không
            const isRealEstateQuestion = (text) => {
                const keywords = [
                    "nhà",
                    "phòng trọ",
                    "căn hộ",
                    "chung cư",
                    "thuê",
                    "mua",
                    "bán",
                    "bất động sản",
                ];
                return keywords.some((kw) => text.toLowerCase().includes(kw));
            };

            let systemPrompt = `Bạn là một trợ lý thông minh. 
Trả lời tất cả các câu hỏi bằng tiếng Việt.`;

            if (isRealEstateQuestion(user_message)) {
                // Lấy max 100 post published
                const posts = await Post.find({ status: "published" }).limit(100);

                // Build post list string (có thêm image)
                const postList = posts
                    .map(
                        (p) =>
                            `- Title: ${p.title}, Address: ${p.address}, Acreage: ${p.acreage} m2, Price: ${p.price}, URL: post/${slugify(
                                p.title
                            )}, Image: ${p.images?.[0] || "no-image"}`
                    )
                    .join("\n");

                systemPrompt += `
Ngoài ra bạn có thể tìm kiếm post bất động sản từ câu hỏi người dùng.
Các post hiện có:
${postList}

Nếu bạn tìm được bài đăng phù hợp, hãy trả lời theo format sau (nhiều nhất 3 bài post):

Tôi đã tìm được x bài đăng phù hợp với nhu cầu của bạn, tham khảo dưới đây.

Bài đăng {số thứ tự}
title: {title}
acreage: {diện tích, ví dụ "20 m2"}
price: {giá, ví dụ "3 triệu"}
url: {đường dẫn, ví dụ "/post/..."}
image: {link ảnh của bài đăng}

Nếu KHÔNG có bài đăng phù hợp thì hãy trả lời:
"Rất tiếc, tôi không tìm thấy bài đăng nào phù hợp với yêu cầu của bạn. 
Nếu bạn có câu hỏi cụ thể hơn về bất động sản, xin vui lòng cho tôi biết!"`;
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: user_message },
                ],
            });

            return {
                success: true,
                message: response.choices[0].message.content,
                token: response.usage,
            };
        } catch (err) {
            console.error("Chatbot Service error:", err);
            return {
                success: false,
                message: "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.",
            };
        }
    };



    generateEmbedding = async (embeddingText) => {
        if (!embeddingText || embeddingText.trim() === "") {
            throw new Error("Embedding text không được để trống");
        }

        try {
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
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