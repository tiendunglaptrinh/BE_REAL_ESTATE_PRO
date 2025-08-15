import mongoose from "mongoose";

const PackagePricingSchema = new mongoose.Schema(
  {
    // Tham chiếu đến gói (Package) mà combo giá này thuộc về
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    // Số ngày áp dụng cho gói này
    // Ví dụ: 7 ngày, 30 ngày, 90 ngày
    duration_days: { 
      type: Number, 
      required: true 
    },

    // Giá tiền cho combo (lưu cứng, không lấy động từ Package để tránh thay đổi lịch sử)
    price: { 
      type: Number, 
      required: true 
    },

    // Trạng thái hoạt động của combo giá này
    // false = không hiển thị / không bán nữa
    is_active: { 
      type: Boolean, 
      default: true 
    },

    // discount giá tiền cho gói
    discount: {
        type: Number,
        default: 0
    }
  },
  { timestamps: true, collection: "package_pri" } // Tự động tạo createdAt và updatedAt
);

export default mongoose.model("PackagePricing", PackagePricingSchema);
