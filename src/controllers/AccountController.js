import Account from "../models/AccountModel.js";
import validator from "validator";
import AccountService from "../services/accountService.js";
import OCRService from "../services/ocrService.js";

class AccountController {
  //[POST] - Create an account - register
  // Step 1:
  // HTTP response 422(Unprocessable Entity) & 409 (Conflict).
  createAccountStep1 = async (req, res, next) => {
    try {
      const {
        fullname,
        email,
        phone,
        birthday,
        sex,
        province,
        adress,
        address,
        CCCD,
        dateCCCD,
        locationCCCD,
      } = req.body;

      if (
        !fullname ||
        ! email ||
        !phone ||
        !birthday ||
        !sex ||
        !province ||
        !address ||
        !CCCD ||
        !dateCCCD ||
        !locationCCCD
      ) {
        return res.status(422).json({
          success: false,
          message: "Điền đẩy đủ các trường thông tin!!!",
        });
      }
      // Check: valid age
      const age = calculateAge(birthday);
      if (age < 18) {
        return res.status(422).json({
          success: false,
          message: "Chưa đủ tuổi để đăng ký sử dụng hệ thống!",
        });
      }
      // Check: valid email
      if (!validator.isEmail(email)) {
        return res.status(422).json({
          success: false,
          message: "Email được nhập không hợp lệ !!!",
        });
      }
      // Check: valid phone
      if (!validator.isMobilePhone(phone, "vi-VN")) {
        return res.status(422).json({
          success: false,
          message: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại",
        });
      }
      // Check valid cccd
      if (!/^\d{12}$/.test(CCCD)) {
        return res.status(422).json({
          success: false,
          message: "Căn cước công dân chưa hợp lệ",
        });
      }

      // Check: duplicate phone & email
      const [existingPhone, existingEmail] = await Promise.all([
        Account.findOne({ phone }),
        Account.findOne({ email }),
      ]);

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Số điện thoại này đã tồn tại trong hệ thống!",
        });
      }

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email này đã tồn tại trong hệ thống!",
        });
      }
      const step = 1;
      const accountData = {
        fullname,
        email,
        phone,
        birthday,
        sex,
        province,
        address,
        CCCD,
        dateCCCD,
        locationCCCD,
        step,
      };
      console.log("Account Data: ", accountData);
      if (!req.session) {
        req.session = {};
      }

      req.session.accountData = accountData;

      return res.status(200).json({
        message: "Bước 1 hoàn tất",
        next_step: 2,
        current_data: accountData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Đã có lỗi xảy ra",
        error: error.message,
      });
      next(error);
    }
  };
  // Step 2: OCR authenticate
  createAccountStep2 = async (req, res, next) => {
    try {
      console.log("Session Data in step 2: ", req.session.accountData);
      const { imageOCR } = req.body;

      const accountData = req.session.accountData;

      if (!accountData) {
        return res.status(422).json({
          success: false,
          message: "Chưa nhập các thông tin cơ bản ở bước 1 !!!",
        });
      }
      accountData.step = 2;

      const ocrResult = await OCRService.verifyOCR(imageOCR, accountData);

      if (ocrResult) {
        return res.status(200).json({
          message: "Xác thực OCR thành công !!!",
          current_data: accountData,
          nex_step: 3,
        });
      } else {
        res.status(422).json({
          message:
            "Xác thực OCR thất bại. Thông tin được nhập không trùng khớp !!!",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đã có lỗi xảy ra",
        error: error.message,
      });
      next(error);
    }
  };
  // Step 3: Password
  createAccountStep3 = async (req, res, next) => {
    try {
      console.log("Session Data in step 3: ", req.session.accountData);
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập đủ thông tin đăng nhập !!!",
        });
      }

      const accountData = req.session.accountData;

      if (!accountData) {
        return res.status(422).json({
          success: false,
          message: "Chưa nhập các thông tin cơ bản ở bước 1 !!!",
        });
      }

      if (accountData.step == 1) {
        return res.status(422).json({
          success: false,
          message: "Chưa xác thực OCR ở bước 2 !!!",
        });
      }

      // Compare:
      if (password !== confirmPassword) {
        return res.status(422).json({
          success: false,
          message: "Nhập lại mật khẩu chưa chính xác !!!",
        });
      }

      accountData.password = password;

      // Đăng ký thành công
      return await AccountService.createAccount(accountData, res);
    } catch (error) {
      return res.status(500).json({
        success: "Đã có lỗi xảy ra",
        error: error.message,
      });
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { info_user, password } = req.body;

      if (!info_user || !password) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập đủ các trường thông tin !!!",
        });
      }

      // Call: Login Service
      const accountLogin = { info_user, password };
      return await AccountService.loginService(accountLogin, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
      next(error);
    }
  };

  updateInfo = async (req, res, next) => {
    try {
      const { full_name, email, phone, birthday } = req.body;
      const user_from_reqURL = req.params.id;
      const user_from_token = req.user.userId;
      console.log("check id user from url: ", user_from_reqURL);
      console.log("check id user from token: ", user_from_token);
      //  Kiểm tra userId từ token và url gửi lên
      if (user_from_reqURL != user_from_token) {
        return res.status(403).json({
          success: false,
          message: "Unauthorization !!!",
        });
      }
      //  Tiếp tục
      if (!full_name || !phone || !email || !birthday) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập thông tin chỉnh sửa đầy đủ !!!",
        });
      }
      const userId = user_from_reqURL;
      const updateData = { userId, full_name, email, phone, birthday };
      return await AccountService.updateInfo(updateData, res);
    } catch (error) {
      return res.status(500).json({
        message: "Update user failed",
        error: error.message,
      });
    }
  };
}

const calculateAge = (date) => {
  const birth = new Date(date);
  const ageDifMs = Date.now() - birth.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default new AccountController();
