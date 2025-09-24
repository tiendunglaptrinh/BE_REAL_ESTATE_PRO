import Account from "../models/AccountModel.js";
import Post from "./../models/PostModel.js";
import Purchase from "./../models/PurchaseModel.js";
import mongoose from "mongoose";
import ChatbotService from "../services/chatbotService.js";
import buildEmbeddingText from "../utils/buildEmbeddingText.js";

class PaymentService {
  paymentNewPostByWallet = async (dataPurchase) => {
    const {
      user_id,
      post_id,
      purchase_code,
      package_pricing_id,
      amount_paid,
      start_date,
      end_date,
    } = dataPurchase;

    console.log("check purchase data: ", dataPurchase);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user_in_DB = await Account.findById(user_id);
      if (!user_in_DB) throw new Error("User không tồn tại");

      const post_in_DB = await Post.findById(post_id);
      if (!post_in_DB) throw new Error("Post không tồn tại");

      // Tạo purchase
      const purchase = await Purchase.create(
        [
          {
            user_id,
            post_id,
            purchase_code,
            package_pricing_id,
            payment_status: "paid",
            amount_paid,
            purchase_type: "new",
            start_date: start_date || new Date(),
            end_date
          },
        ],
        { session }
      );

      // trừ tiền
      if (user_in_DB.wallet < amount_paid) throw new Error("Số dư không đủ");
      user_in_DB.wallet -= amount_paid;
      await user_in_DB.save({ session });

      // Chuyển trạng thái post sang published
      post_in_DB.status = "published";

      // // --- Tạo embedding vector ngay khi post được publish ---
      // const embeddingText = buildEmbeddingText(post_in_DB); // Hàm buildEmbeddingText
      // const embeddingResult = await ChatbotService.generateEmbedding(embeddingText);

      // if (!embeddingResult.success) {
      //   console.warn("Không tạo được vector embedding:", embeddingResult.message);
      //   // vẫn commit post, không block user
      // } else {
      //   post_in_DB.embedding = embeddingResult.data;
      // }

      await post_in_DB.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Thanh toán thành công",
        data: purchase[0],
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: err.message || "Lỗi bất định hệ thống",
      };
    }
  };

  paymentNewPostByPaypal = async (dataPurchase) => {
    const {
      user_id,
      post_id,
      purchase_code,
      package_pricing_id,
      amount_paid,
      start_date,
      end_date,
    } = dataPurchase;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user_in_DB = await Account.findById(user_id);
      if (!user_in_DB) throw new Error("User không tồn tại");

      const post_in_DB = await Post.findById(post_id);
      if (!post_in_DB) throw new Error("Post không tồn tại");

      // Tạo purchase (đã trả qua PayPal, không trừ ví)
      const purchase = await Purchase.create(
        [
          {
            user_id,
            post_id,
            purchase_code,
            package_pricing_id,
            payment_status: "paid",
            amount_paid,
            purchase_type: "new",
            start_date: start_date || new Date(),
            end_date,
          },
        ],
        { session }
      );

      // Cập nhật post từ draft → published
      post_in_DB.status = "published";

      // // --- Tạo embedding vector ngay khi post được publish ---
      // const embeddingText = buildEmbeddingText(post_in_DB);
      // const embeddingResult = await ChatbotService.generateEmbedding(embeddingText);

      // if (!embeddingResult.success) {
      //   console.warn("Không tạo được vector embedding:", embeddingResult.message);
      //   // vẫn commit post, không block user
      // } else {
      //   post_in_DB.embedding = embeddingResult.data;
      // }

      await post_in_DB.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Thanh toán PayPal thành công",
        data: purchase[0],
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: err.message || "Lỗi bất định hệ thống",
      };
    }
  };
}

export default new PaymentService();
