import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    // Người mua gói
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    purchase_code: {
      type: String,
      required: true,
      unique: true
    },

    // Bài đăng được áp dụng gói này
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      // required: true,
    },

    // Gói + thời hạn + giá đã chọn (PackagePricing)
    package_pricing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackagePricing",
      // required: true,
    },

    // Loại giao dịch
    purchase_type: {
      type: String,
      enum: ["new", "renew", "upgrade"],
      required: true, 
      default: "new",
    },

    // Số tiền người dùng đã thanh toán cho giao dịch này
    // (lưu cứng để không bị thay đổi khi giá gói update)
    amount_paid: { 
      type: Number, 
      required: true 
    },

    // Gói cũ trước khi nâng cấp (chỉ dùng khi purchase_type = "upgrade")
    previous_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackagePricing",
      default: null,
    },

    // Ngày bắt đầu áp dụng gói cho bài viết
    start_date: { 
      type: Date, 
    },

    // Ngày kết thúc hiệu lực gói cho bài viết
    end_date: { 
      type: Date, 
    },

    // Trạng thái thanh toán
    // pending = chưa thanh toán xong (hoặc đang chờ cổng thanh toán callback)
    // paid = đã thanh toán thành công
    // failed = thanh toán thất bại
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Mã giao dịch từ cổng thanh toán (Momo, VNPay, Stripe,...)
    transaction_id: { 
      type: String,
      default: "personal",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", PurchaseSchema);
