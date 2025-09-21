import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Account",
            required: true,
        },
        // Mảng các String chứa đường dẫn cloudinary
        images: [String],

        location: {
            province: { type: String, required: true },
            ward: { type: String },
        },

        // Bài viết cần được admin duyệt mới có thể đăng lên
        status: {
            type: String,
            enum: ["published", "pending", "delete", "hidden"],
            required: true,
            default: "pending",
        },

        // Đường dẫn đến bài viết (trong hệ thống)
        linked_post: {
            type: String,
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
