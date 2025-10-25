import mongoose from 'mongoose';

const ReportSchema = mongoose.Schema({

    // Người gửi báo cáo
    sender_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Account",
        required: true
    },

    // Đối tượng báo cáo
    object_report: {
        type: String,
        required: true,
        enum: ["post", "status", "user"]
    },

    // Id định danh đối tượng
    object_id: {
        type: String,
        required: true,
    },

    // Lý do báo cáo, cho người dùng nhập list String cho format đẹp
    reason: {
        type: [String],
        required: true,
        default: []
    },

    // Hình ảnh minh chứng
    images: {
        type: [String],
        required: true,
        default: []
    },

    // Tình trạng xử Lý
    status: {
        type: String,
        required: true,
        enum: ['pending', 'reject', 'accept']
    }

},
    { timstamps: true }
)

