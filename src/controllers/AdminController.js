import Account from "./../models/AccountModel.js";
import AdminService from "../services/adminService.js";

class AdminController {
  getAllAccounts = async (req, res) => {
    try {

      const response = await AdminService.getAllInfoUser();

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Lấy danh sách người dùng thành công",
          data: response.data
        })
      }
      else {
        return res.status(404).json({
          success: false,
          message: "Lấy danh sách người dùng thất bại"
        })
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách tài khoản",
        error: error.message,
      });
    }
  };

  banAccount = async (req, res) => {
    try {
      const { userId } = req.body;

      const response = await AdminService.banAccount(userId);

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Khóa tài khoản người dùng thành công"
        });
      }
      else {
        return res.status(404).json({
          success: false,
          message: "Khóa tài khoản người dùng không thành công"
        })
      }
    }
    catch (err) {
      console.log("Error in Ban Account Controller", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }
  }

  unBanAccount = async (req, res) => {
    try {
      const { userId } = req.body;

      const response = await AdminService.unBanAccount(userId);

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Mở khóa tài khoản người dùng thành công"
        });
      }
      else {
        return res.status(404).json({
          success: false,
          message: "Mở khóa tài khoản người dùng không thành công"
        })
      }
    }
    catch (err) {
      console.log("Error in Ban Account Controller", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }
  }

  statisticPost = async (req, res) => {
    try {

    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi thống kê bài đăng"
      })
    }
  }

  getListPostMange = async (req, res) => {
    try {
      const { page, limit } = req.query;

      const pageParam = Number(page) || 1;
      const limitParam = Number(limit) || 4;

      const response = await AdminService.getListPostManage(pageParam, limitParam);

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Lấy danh sách thông tin bài đăng thành công !!!",
          data: response.data
        })
      }
      else {
        return res.status(404).json({
          success: false,
          message: "Lấy danh sách bài đăng thất bại !!!"
        })
      }
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy thông tin bài đăng"
      })
    }
  }

  approveStatus = async (req, res) => {
    try {
      const { statusId } = req.body;

      if (!statusId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu statusId"
        })
      }

      const response = await AdminService.approveStatus(statusId);

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Duyệt status thành công"
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Duyệt status không thành công"
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi duyệt status"
      })
    }
  }

  cancelStatus = async (req, res) => {
    try {
      const { statusId } = req.body;
      if (!statusId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu statusId"
        })
      }
      const response = await AdminService.cancelStatus(statusId);
      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Từ chối status thành công"
        });
      }
      else {
        return res.status(404).json({
          success: false,
          message: "Từ chối status không thành công"
        })
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi từ chối status"
      })
    }
  }
  
  getListStatus = async (req, res) => {
    try {
      const listStatus = await AdminService.getListStatus();

      if (listStatus.success) {
        return res.status(200).json({
          success: true,
          message: "Lấy danh sách status thành công",
          data: listStatus.data
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Lấy danh sách status không thành công"
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi lấy danh sách status"
      });
    }
  }

  deletePostByAdmin = async (req, res) => { }

  deleteStatusByAdmin = async (req, res) => { }

  getMoneyStatistic = async (req, res) => { }
}

export default new AdminController();