import mongoose from "mongoose";

const RealEstateCategorySchema = new mongoose.Schema(
  {
    // Loại chính: Bán, Thuê, Dịch vụ
    type: {
      type: String,
      enum: ["sell", "rent", "short_utility", "service"],
      required: true,
    },

    // Tên loại hình cụ thể (VD: Căn hộ chung cư, Nhà phố, Đất nền)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Trạng thái hoạt động
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "real_estate_categories" }
);

export default mongoose.model("RealEstateCategory", RealEstateCategorySchema);
