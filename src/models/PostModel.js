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
    district: {
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
    unitPrice: {
      type: String, // Ví dụ: 'triệu/m2', 'triệu/tháng'
      required: true,
    },
    interior: {
      type: Map, // Có thể dùng Map để lưu các nội thất và thông tin khác
      of: String,
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
    goiTinDang: {
      type: String, // 'Kim Cương', 'Vàng', 'Bạc', 'Thường'
      required: true,
    },
    gia: {
      type: Number, // Tính tổng tiền của gói
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Liên kết tới user (Account)
      ref: "Account", // Tham chiếu đến model 'Account'
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", Post);

export default PostModel;
