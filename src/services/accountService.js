import Account from "./../models/AccountModel.js";
import { HashPassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "./jwtService.js";
import { CompareHash } from "../utils/hash.js";

class AccountService {
  createAccount = async (userData, response) => {
    try {
      const hashedPassword = await HashPassword(userData.password, 10);
      const hashedCCCD = await HashPassword(userData.CCCD, 10);

      const account = new Account({
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        birthday: new Date(userData.birthday),
        password: hashedPassword,
        province: userData.province,
        address: userData.address,
        isAdmin: false,
        CCCD: hashedCCCD,
        dateCCCD: userData.dateCCCD,
        locationCCCD: userData.locationCCCD,
        wallet: 50000,
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
  loginService = async (accountLogin, response) => {
    const { info_user, password } = accountLogin;
    const userAccount = await Account.findOne({
      $or: [{ email: info_user }, { phone: password }],
    });

    if (userAccount) {
      const isMatch = await CompareHash(password, userAccount.password);
      if (isMatch) {
        const access_token = await generateAccessToken({
          userId: userAccount._id,
          userRole: userAccount.isAdmin
        });
        const refresh_token = await generateRefreshToken({
          userId: userAccount._id,
          userRole: userAccount.isAdmin
        });
        // console.log(">>> check access token: ", access_token);
        // console.log(">>> check refresh token: ", refresh_token);
        return response.status(200).json({
          success: true,
          message: "Đăng nhập thành công !!!",
          access_token,
          refresh_token,
        });
      } else {
        return response.status(422).json({
          success: false,
          message: "Mật khẩu không đúng. Vui lòng kiểm tra lại !!!",
        });
      }
    } else {
      return response.status(422).json({
        success: false,
        message: "Tài khoản không tồn tại trong hệ thống !!!",
      });
    }
  };
  updateInfo = async (userData, response) => {
    try {
      const { userId, full_name, email, phone, birthday } = userData;
      const infoUpdate = { full_name, email, phone, birthday };
  
      const user = await Account.findOneAndUpdate({ _id: userId }, infoUpdate, {
        new: true,
      });
  
      if (!user) {
        return response.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng !!!",
        });
      }
  
      return response.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công !!!",
        data: user,
      });
    } catch (error) {
      console.error("Lỗi trong service updateInfo:", error.message); // Debug lỗi
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  
}

export default new AccountService();
