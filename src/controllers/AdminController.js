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
      else{
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
}

export default new AdminController();