import Account from "./../models/AccountModel.js";
import HashPassword from "../utils/hash.js";

class AccountService {
  createAccount = async (userData, response) => {
    try {
      const hashedPassword = await HashPassword(userData.password, 10);
      const hashedCCCD = await HashPassword(userData.CCCD, 10);

      const account = new Account({
        fullname: userData.fullname,
        password: hashedPassword,
        email: userData.email,
        // birthday: new Date(userData.date_of_birth),
        phone: userData.phone,
        address: userData.address,
        isAdmin: false,
        CCCD_id: hashedCCCD,
        money_in_wallet: 0,
        active: false,
        status: "normal",
      });

      console.log("Information of account: ", account);

      await account.save();

      if (!response.headersSent) {
        return response.status(200).json({
          success: true,
          message: "Đăng ký tài khoản thành công !!!",
          data: account,
        });
      }
    } catch (error) {
      console.error("Error creating account: ", error);
      return response.status(500).json({
        success: false,
        message: "Không thể tạo tài khoản",
        error: error.message || error,
      });
    }
  };
}

export default new AccountService();
