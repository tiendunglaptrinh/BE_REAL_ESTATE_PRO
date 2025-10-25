import Account from "../models/AccountModel.js";
import Post from "../models/PostModel.js";
import Status from "../models/StatusModel.js";

class AdminService {
  getAllInfoUser = async () => {
    try {
      const listAccount = await Account.aggregate([
        {
          $match: { is_admin: false }
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "user_id",
            as: "posts"
          }
        },
        {
          $lookup: {
            from: "status",
            localField: "_id",
            foreignField: "user_id",
            as: "status_post"
          }
        },
        {
          $addFields: {
            num_post: { $size: "$posts" },
            num_status: { $size: "$status_post" }
          }
        },
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
      console.error(" AdminService.getAllInfoUser aggregate error:", err);
      return {
        success: false,
        message: "Internal server error"
      };
    }
  };

  banAccount = async (userId) => {
    try {
      const account = await Account.findById(userId);

      if (!account) {
        return {
          success: false,
          message: "Account not found"
        };
      }

      account.status = "banned";
      await account.save();

      return {
        success: true,
        message: "Account has been banned successfully",
        data: account
      };
    } catch (error) {
      console.error("Error banning account:", error);
      return {
        success: false,
        message: "Server error while banning account"
      };
    }
  }

  unBanAccount = async (userId) => {
    try {
      const account = await Account.findById(userId);

      if (!account) {
        return {
          success: false,
          message: "Account not found"
        };
      }

      account.status = "normal";
      await account.save();

      return {
        success: true,
        message: "Account has been unbanned successfully",
        data: account
      };
    } catch (error) {
      console.error("Error unbanning account:", error);
      return {
        success: false,
        message: "Server error while unbanning account"
      };
    }
  }

  getListPostManage = async (pageParam, limitParam) => {
    try {
      const page = parseInt(pageParam, 10);
      const limit = parseInt(limitParam, 10);
      const skip = (page - 1) * limit;


      const totalPosts = await Post.countDocuments({});

      const listPost = await Post.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        success: true,
        message: "Lấy danh sách bài đăng thành công",
        data: {
          listPost,
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalItems: totalPosts,
          limit,
        }
      };
    } catch (err) {
      console.error("Error in getListPostManage:", err);
      return {
        success: false,
        message: "Lỗi server khi lấy danh sách bài đăng",
      };
    }
  };

  approveStatus = async (statusId) => {
    try {
      // Tìm status theo ID
      const status = await Status.findById(statusId);
      if (!status) {
        return {
          success: false,
          message: "Status không tồn tại"
        };
      }
      // Cập nhật trạng thái thành "published"
      status.status = "published";
      await status.save();
      return {
        success: true,
        message: "Duyệt status thành công",
        data: status
      };
    } catch (err) {
      console.error("Error in approveStatus:", err);
      return {
        success: false,
        message: "Lỗi server khi duyệt status",
      };
    }
  }

  cancelStatus = async (statusId) => {
    try {
      // Tìm status theo <ID></ID>
      const status = await Status.findById(statusId);
      if (!status) {
        return {
          success: false,
          message: "Status không tồn tại"
        };
      }
      // Cập nhật trạng thái thành "cancel"
      status.status = "cancel";
      await status.save();

      return {
        success: true,
        message: "Hủy status thành công",
        data: status
      };
    } catch (err) {
      console.error("Error in cancelStatus:", err);
      return {
        success: false,
        message: "Lỗi server khi hủy status",
      };
    }
  };


  getListStatus = async () => {
    try {
      const listStatus = await Status.find({})
        .populate('user_id', 'username email fullname') // Đã có user info rồi
        .sort({ createdAt: -1 });

      return {
        success: true,
        message: "Lấy danh sách status thành công",
        data: listStatus
      };
    } catch (err) {
      console.error("Error in getListStatus:", err);
      return {
        success: false,
        message: "Lỗi server khi lấy danh sách status",
      };
    }
  };

}

export default new AdminService();