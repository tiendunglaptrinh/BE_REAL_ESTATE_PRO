import Account from "../models/AccountModel.js";

class AdminService {
  getAllInfoUser = async () => {
    try {
      const listAccount = await Account.aggregate([
        // 1️⃣ Lọc ra user thường, bỏ admin
        {
          $match: { is_admin: false }
        },
        // 2️⃣ Join với collection "posts"
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user_id",
            as: "posts"
          }
        },
        // 3️⃣ Join với collection "statuses"
        {
          $lookup: {
            from: "status",
            localField: "_id",
            foreignField: "user_id",
            as: "status_post"
          }
        },
        // 4️⃣ Thêm field đếm số lượng
        {
          $addFields: {
            num_post: { $size: "$posts" },
            num_status: { $size: "$status_post" }
          }
        },
        // 5️⃣ Loại bỏ danh sách chi tiết nếu không cần
        {
          $project: {
            posts: 0,
            statuses: 0
          }
        }
      ]);

      return {
        success: true,
        data: listAccount
      };
    } catch (err) {
      console.error("🔥 AdminService.getAllInfoUser aggregate error:", err);
      return {
        success: false,
        message: "Internal server error"
      };
    }
  };
}

export default new AdminService();
