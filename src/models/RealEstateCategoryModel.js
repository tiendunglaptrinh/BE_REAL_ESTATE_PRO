import mongoose from "mongoose";

const RealEstateCategorySchema = new mongoose.Schema(
  {
    // Loại chính: Bán, Thuê, Dịch vụ
    type: {
      type: String,
      enum: ["Bán", "Thuê", "Dịch vụ"],
      required: true,
    },

    // Tên loại hình cụ thể (VD: Căn hộ chung cư, Nhà phố, Đất nền)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Mô tả thêm (optional)
    description: {
      type: String,
      default: "",
    },

    // Thứ tự sắp xếp hiển thị
    sort_order: {
      type: Number,
      default: 0,
    },

    // Trạng thái hoạt động
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RealEstateCategory", RealEstateCategorySchema);
