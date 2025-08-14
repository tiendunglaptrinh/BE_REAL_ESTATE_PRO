import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    needs: {
      type: String,
      enum: ["Bán", "Thuê"],
      required: true,
    },
    address: { type: String, required: true },
    province: { type: String, required: true },
    ward: { type: String, required: true },
    type: { type: String, required: true },
    acreage: { type: Number, required: true },
    price: { type: Number, required: true },
    unit_price: { type: String, required: true },
    discount: { type: Number, default: 0 },
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
        facility_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Facility",
          required: true,
        },
      },
    ],
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String },

    // Gói đăng hiện tại
    current_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    // Trạng thái hết hạn
    time_expire: { type: Date, required: true },

    // Trạng thái giao dịch
    is_traded: { type: Boolean, default: false },

    // Thông tin tương tác
    num_like: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
    level_auth: { type: Number, default: 0 },

    // Người đăng
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },

    // lịch sử đổi gói
    history_pricing: [
      {
        packagePricingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PackagePricing",
          required: true,
        },
        purchasedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
