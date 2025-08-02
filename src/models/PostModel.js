import mongoose from "mongoose";

const Post = mongoose.Schema(
  {
    needs: {
      type: String,
      enum: ["Bán", "Thuê"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    province: {
      type: String, // Tỉnh thành
      required: true,
    },
    ward: {
      type: String, // Quận huyện
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    acreage: {
      type: Number, // Diện tích của bất động sản
      required: true,
    },
    price: {
      type: Number, // Giá trị bất động sản
      required: true,
    },
    unit_price: {
      type: String, // Ví dụ: 'triệu/m2', 'triệu/tháng'
      required: true,
    },
    discount: { // 10 %,...
      type: Number,
      default: 0,
    },
    interior: {
      type: String,
    },
    num_room: {
      type: Number,
      default: 0
    },
    num_bathroom: {
      type: Number,
      default: 0
    },
    title: {
      type: String, // Tiêu đề tin đăng
      required: true,
    },
    description: {
      type: String, // Mô tả chi tiết tin đăng
      required: true,
    },
    images: {
      type: [String], // Các hình ảnh của tin đăng
      required: true,
    },
    video: {
      type: String, // Link video (không bắt buộc)
    },
    post_packet: {
      type: String, // 'Kim Cương', 'Vàng', 'Bạc', 'Thường'
      required: true,
    },
    packet_post: {
      type: Number, // Tính tổng tiền của gói
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Liên kết tới user (Account)
      ref: "Account", // Tham chiếu đến model 'Account'
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", Post);

export default PostModel;
