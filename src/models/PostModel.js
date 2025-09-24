import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    needs: { type: String, enum: ["sell", "rent"], required: true },

    // Đỉa chỉ
    address: { type: String, required: true },
    province: { type: String, required: true },
    ward: { type: String, required: true },

    address_slug: { type: String, required: true },
    province_slug: { type: String, required: true },
    ward_slug: { type: String, required: true },

    // thông số cơ bản
    acreage: { type: Number, required: true },
    price: { type: Number, required: true },
    unit_price: { type: String, required: true },
    price_vnd: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    // Loại hình
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RealEstateCategory",
      required: true,
    },

    // Thành phần bất động sản
    property_components: [
      {
        component_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PropertyComponent",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],

    // Tiện ích (facilities)
    facilities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
      }
    ],

    // Mô tả
    title: { type: String, required: true },
    title_slug: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String },

    // Gói đăng hiện tại
    current_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    // Thời điểm hết hạn
    time_expire: { type: Date, required: true },

    // Trạng thái bài đăng
    status: {
      type: String,
      enum: ["draft", "pending", "published", "hidden", "deleted", "blocked"],
      required: true,
      default: "draft",
    },

    // Trạng thái giao dịch
    is_traded: { type: Boolean, default: false },

    // Thông tin tương tác
    likes_count: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
    level_auth: { type: Number, default: 0 },

    // Người đăng
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    // coordinates
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },

    // lịch sử đổi gói
    history_pricing: [
      {
        package_pricing_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PackagePricing",
          required: true,
        },
        purchased_at: { type: Date, default: Date.now },
      },
    ],
    message_contact: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "MessageContact",
      default: []
    },
    // vector embedding để chatbot tìm kiếm
    embedding: {
      type: [Number],
      default: [],
      select: false, // ẩn khi query bình thường, chỉ load khi cần
    }

  },
  { timestamps: true }
);

// Post model
PostSchema.index({ needs: 1, province: 1, ward: 1 });
PostSchema.index({ price: 1 });
PostSchema.index({ acreage: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ current_package: 1 });

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
