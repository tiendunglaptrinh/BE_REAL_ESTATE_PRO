import Account from "./../models/AccountModel.js";
import { HashPassword } from "../utils/hash.js";
import JWTService from "./jwtService.js";
import { CompareHash } from "../utils/hash.js";
import "dotenv";
import rateLimitStore from "../utils/rateLimitStore.js";
import jwt from "jsonwebtoken";
import axios from "axios";

class AccountService {
  createAccount = async (userData, response) => {
    try {

      const hashedPassword = await HashPassword(
        "password",
        userData.password,
        process.env.SALT_ROUND_HASH
      );
      const hashedCCCD = await HashPassword(
        "cccd",
        userData.cccd,
        process.env.SALT_ROUND_HASH
      );

      const account = new Account({
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        birthday: new Date(userData.birthday),
        sex: userData.sex,
        password: hashedPassword,
        province: userData.province,
        address: userData.address,
        is_admin: false,
        cccd: hashedCCCD,
        date_cccd: userData.dateCCCD,
        location_cccd: userData.locationCCCD,
        wallet: 50000,
        status: "normal",
      });

      await account.save();

      return {
        success: true,
        message: "Đăng ký tài khoản thành công !!!",
      }
    } catch (error) {
      console.error("Error creating account: ", error);
      return {
        success: false,
        message: "Không thể tạo tài khoản !"
      };
    }
  };
  loginService = async (accountLogin, response) => {
    const { info_user, password, token_captcha } = accountLogin;
    console.log(token_captcha);
    // logic gửi lên google
    if (token_captcha) {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

      try {
        const verifyResponse = await axios.post(verifyUrl, null, {
          params: {
            secret: secretKey,
            response: token_captcha,
          },
        });

        if (!verifyResponse.data.success) {
          return {
            success: false,
            message: "Captcha verification failed, please try again.",
            captcha_required: true,
          };
        }
      } catch (err) {
        // lỗi mạng hoặc Google không phản hồi
        return {
          success: false,
          message: "Error verifying captcha, please try later.",
          captcha_required: true,
        };
      }
    }
    const now = Date.now();

    // Test state of user in system
    const loginState = await rateLimitStore.get(info_user);
    if (loginState?.lock_until && loginState.lock_until > now) {
      const wait = Math.ceil((loginState.lock_until - now) / 1000);
      return response.status(429).json({
        success: false,
        message: `Tài khoản tạm thời bị khóa. Vui lòng thử lại sau ${wait} giây.`,
        captcha_required: true,
        captcha_expire: loginState.captcha_expire,
        wait_seconds: wait,
      });
    }

    // Find user in database
    const userAccount = await Account.findOne({
      $or: [{ email: info_user }, { phone: info_user }],
    });

    if (userAccount) {
      const isMatch = await CompareHash(password, userAccount.password);
      if (isMatch) {
        const userRole = userAccount.is_admin ? "admin" : "user";
        // Login successfully
        await rateLimitStore.clear(info_user);
        const access_token = await JWTService.generateAccessToken({
          userId: userAccount._id,
          userRole,
          userAvatar: userAccount.avatar,
          userSex: userAccount.sex,
        });
        const refresh_token = await JWTService.generateRefreshToken({
          userId: userAccount._id,
          userRole,
          userAvatar: userAccount.avatar,
          userSex: userAccount.sex,
        });

        return response.status(200).json({
          success: true,
          message: "Đăng nhập thành công !",
          access_token,
          refresh_token,
        });
      } else {
        await rateLimitStore.recordFailedAttempt(info_user);
        const updated = await rateLimitStore.get(info_user);
        const remaining =
          rateLimitStore.MAX_ATTEMPTS - (updated.failed_attempts || 0);
        const captcha = updated.captcha_required || false;
        return response.status(422).json({
          success: false,
          message:
            remaining > 0
              ? `Mật khẩu không đúng. Còn ${remaining} lần thử.`
              : "Tài khoản bị khóa 30 giây vì nhập sai quá nhiều.",
          captcha_required: captcha,
          wait_seconds: remaining > 0 ? null : 30,
        });
      }
    } else {
      await rateLimitStore.recordFailedAttempt(info_user);
      return response.status(422).json({
        success: false,
        message:
          "Thông tin tài khoản chưa chính xác! Vui lòng kiểm tra lại thông tin",
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
      console.error("Lỗi trong service updateInfo:", error.message);
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  getInfoUser = async (requestAnimationFrame, res) => {
    try {
      decodeToken = JWTService.decodeToken(getTokenfromHeader(req));
      if (!decodeToken) {
        return res.status(402).json({
          success: false,
          message: "Unauthorization !!!",
        });
      }
      const userId = req.params.id;
      console.log(">>> check user id: ", userId);
      console.log(">>> check decodeToken: ", decodeToken);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: errror.message,
      });
    }
  };
  // AccountService.js
  getContact = async (user) => {
    try {
      const userId = user.userId;
      console.log(">>> check user id: ", userId);
      const user_in_DB = await Account.findById(userId);
      const {fullname, email, phone, _id} = user_in_DB;
      return {id:_id, fullname, email, phone}
    } catch (err) {
      throw new Error(err.message);
    }
  };
  
  getMoneyWallet = async (user) => {
    try{
      const userId = user.userId;
      console.log(">>> check user id: ", userId);
      
      const user_in_DB = await Account.findById(userId);
      console.log(">>> check user: ", user_in_DB);
      return user_in_DB.wallet;
    }
    catch (err){
      return -1;
    }
  }
}

export default new AccountService();
