import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    // Tên gói hiển thị cho người dùng
    // enum: chỉ cho phép một trong các giá trị cố định
    name: {
      type: String,
      required: true,
      enum: ["Kim cương", "Vàng", "Bạc", "Thường"],
    },

    // Mô tả chi tiết về gói (optional)
    description: { 
      type: String 
    },

    // Mức độ ưu tiên của gói (càng cao càng được ưu tiên hiển thị)
    priority_level: { 
      type: Number, 
      default: 0 
    },

    // Trạng thái hoạt động của gói
    // false = ngưng cung cấp / ẩn khỏi danh sách bán
    is_active: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true } // Tự động tạo createdAt và updatedAt
);

export default mongoose.model("Package", PackageSchema);
