import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Account",
            required: true,
        },
        // Mảng các String chứa đường dẫn cloudinary
        image: {
            type: String,
            default: ""
        },

        province: {
            type: String
        },

        // content
        content: {
            type: String,
            required: true
        },

        // Bài viết cần được admin duyệt mới có thể đăng lên
        status: {
            type: String,
            enum: ["published", "pending", "delete", "hidden", "cancel"],
            required: true,
            default: "pending",
        },

        // Đường dẫn đến bài viết (trong hệ thống)
        linked_post: {
            type: String,
        },

        // Mục đích đăng: shared = chia sẻ, find = tìm kiếm, post = đăng bài đăng, 
        mean: {
            type: String,
            enum: ["shared", "find", "post"]
        },

        // Số like
        num_like: {
            type: Number,
            default: 0,
        },

        // Mảng các user_id của các user yêu cầu liên hệ
        list_concern: [
            { type: mongoose.Schema.ObjectId, ref: "Account" }
        ],
    },
    { timestamps: true }
);

// Index để query nhanh theo createdAt hoặc location
StatusSchema.index({ createdAt: -1 });
StatusSchema.index({ "location.province": 1 });

const StatusModel = mongoose.model("Status", StatusSchema);
export default StatusModel;
