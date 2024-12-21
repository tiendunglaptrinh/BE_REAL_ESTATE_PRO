import Account from "./../models/AccountModel.js";

class AdminController {
  getAllAccounts = async (req, res) => {
    try {
      const accounts = await Account.find({});
      res.status(200).json({
        success: true,
        count: accounts.length,
        data: accounts,
      });
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
