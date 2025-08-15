import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    // Tên gói hiển thị cho người dùng
    name: {
      type: String,
      required: true,
      enum: ["HomePro Kim cương", "HomePro Vàng", "HomePro Bạc", "HomePro Thường"],
    },

    // Mô tả chi tiết về gói (optional)
    description: { 
      type: String 
    },

    // Ưu tiên hiển thị
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
  { timestamps: true }
);

export default mongoose.model("Package", PackageSchema);
