import Account from "../models/AccountModel.js";
import validator from "validator";
import AccountService from "../services/accountService.js";
import OCRService from "../services/ocrService.js";
import OTPEmailService from "../services/otpEmailService.js";
import JWTService from "../services/jwtService.js";
import { HashPassword } from "../utils/hash.js";
class AccountController {
  //[POST] - Create an account - register
  // Step 1:
  // HTTP response 422(Unprocessable Entity) & 409 (Conflict).
  createAccountStep1 = async (req, res, next) => {
    console.log("body step 1: ", req.body);
    try {
      const {
        fullname,
        email,
        phone,
        birthday,
        sex,
        province,
        address,
        cccd,
        date_cccd,
        location_cccd,
      } = req.body;

      // Check: Fill fully Information
      if (
        !fullname ||
        !email ||
        !phone ||
        !birthday ||
        !sex ||
        !province ||
        !address ||
        !cccd ||
        !date_cccd ||
        !location_cccd
      ) {
        return res.status(422).json({
          success: false,
          message: "Điền đẩy đủ các trường thông tin!!!",
        });
      }

      // Check: valid age in system
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
      if (!/^\d{12}$/.test(cccd)) {
        return res.status(422).json({
          success: false,
          message: "Căn cước công dân chưa hợp lệ",
        });
      }

      // Check: duplicate phone & email & cccd
      const [existingPhone, existingEmail, existingCccd] = await Promise.all([
        Account.findOne({ phone }),
        Account.findOne({ email }),
        Account.findOne({ cccd }),
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

      if (existingCccd) {
        return res.status(409).json({
          success: false,
          message: "Căn cước đã tồn tại trong hệ thống!",
        });
      }

      const otp = await OTPEmailService.sendOTP(req);

      // Log: All fields of information accepts
      // info fill: { fullname, email, phone, birthday, sex, province, address, cccd, date_cccd, location_cccd, } = req.body;
      const step_register = 1;
      const authen = 0;
      const accountData = {
        fullname,
        email,
        phone,
        birthday,
        sex,
        province,
        address,
        authen,
        cccd,
        date_cccd,
        location_cccd,
        step_register,
      };
      console.log(
        "[Register] >> Step 1: Account Information After Step 1",
        accountData
      );
      if (!req.session) {
        req.session = {};
      }

      req.session.accountData = accountData;

      return res.status(200).json({
        success: true,
        message: "Bước 1 hoàn tất, otp đã được gửi đi",
        next_step: 2,
        current_data: accountData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server log: Đã có lỗi xảy ra",
        error: error.message,
      });
      next(error);
    }
  };
  // Step 2: OTP send through Email STMP
  createAccountStep2 = async (req, res, next) => {
    try {
      console.log("Session Data in step 2: ", req.session.accountData);
      const { otp } = req.body;

      const accountData = req.session.accountData;

      if (!accountData) {
        return res.status(422).json({
          success: false,
          message: "Chưa nhập các thông tin cơ bản ở bước 1 !!!",
        });
      }

      accountData.step_register = 2;

      const otp_result = await OTPEmailService.verifyOTP(
        accountData.email,
        otp
      );

      if (otp_result) {
        accountData.authen = 1;
        return res.status(200).json({
          success: true,
          message: "Xác thực OTP thành công !!!",
          current_data: accountData,
          nex_step: 3,
        });
      } else {
        res.status(422).json({
          success: false,
          message: "OTP sai hoặc đã hết hạn. Xác thực OTP không thành công !",
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
      const { forward_cccd, backward_cccd } = req.body;
      const accountData = req.session.accountData;

      if (!accountData) {
        return res.status(422).json({
          success: false,
          message: "Chưa nhập các thông tin cơ bản ở bước 1 !!!",
        });
      }
      if (!forward_cccd && !backward_cccd) {
        accountData.authen = 1;
        return res.status(200).json({
          success: true,
          message: "Bạn đã bỏ qua bước xác thực căn cước công dân",
          current_data: accountData,
          nex_step: 4,
        });
      }

      if (!forward_cccd) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng upload mặt trước Căn cước công dân",
        });
      }
      if (!backward_cccd) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng upload mặt sau Căn cước công dân",
        });
      }



      if (accountData.step_register == 1) {
        return res.status(422).json({
          success: false,
          message: "Chưa xác thực OTP ở bước 2 !!!",
        });
      }

      // Verify CCCD
      const ocr_result = await OCRService.verifyOCR(
        forward_cccd,
        backward_cccd,
        res
      );

      if (ocr_result) {
        accountData.authen = 2;
        return res.status(200).json({
          success: true,
          message: "Xác thực OCR thành công !!!",
          current_data: accountData,
          nex_step: 4,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Xác thực OCR không thành công !!!",
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

  createAccountStep4 = async (req, res, next) => {
    try {
      const { password, confirm_password } = req.body;

      if (!password || !confirm_password) {
        res.status(422).json({
          success: false,
          message: "vui lòng nhập đủ các trường thông tin !",
        });
      }

      const accountData = req.session.accountData;
      if (!accountData) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập các thông tin cơ bản trước đó !!!",
        });
      }

      if (accountData.step_register == 1) {
        return res.status(422).json({
          success: false,
          message: "Chưa xác thực OTP !!!",
        });
      }

      // Thêm logic bắt buộc phải có chữ thường, chữ số, ký tự đặc biệt, độ dài ít nhất 8 ký tự.
      if (password.length < 9) {
        res.status(500).json({
          success: false,
          message: "Mật khẩu phải có ít nhất 9 ký tự !",
        });
      }

      // Dùng regex để phát hiện có chữ thường, chữ số và ký tự đặc biệt
      // TODO

      // Check password = confirm_password
      if (password != confirm_password) {
        res.status(500).json({
          success: false,
          message: "Nhập lại mật khẩu chưa khớp !",
        });
      }

      accountData.password = password;
      console.log(">>> check password in account: ", accountData.password);

      const response = await AccountService.createAccount(accountData, res);

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: response.message
        })
      }
      else {
        return res.status(409).json({
          success: false,
          message: response.message
        })
      }
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }
  };

  login = async (req, res, next) => {
    try {
      const { info_user, password, token_captcha } = req.body;

      if (!info_user || !password) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập đủ các trường thông tin !!!",
        });
      }

      // Call: Login Service
      const accountLogin = { info_user, password, token_captcha };
      return await AccountService.loginService(accountLogin, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
      next(error);
    }
  };

  getCurrentUser = async (req, res) => {
    try {
      const { userId } = req.user;
      res.status(200).json({
        success: true,
        message: "Authenticated successfully",
        user: req.user,
      });
    } catch (err) {
      throw err.message;
    }
  };

  updateInfo = async (req, res) => {
    try {
      const { userId } = req.user; // userId đã được lấy từ token
      const { fullname, birthday, sex } = req.body;

      const account = await Account.findByIdAndUpdate(
        userId,
        {
          fullname,
          birthday,
          sex,
        },
        { new: true, runValidators: true } // new: trả về doc sau khi update, runValidators: check enum, required...
      );

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tài khoản",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Update thành công"
      });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
      });
    }
  };


  getInfoUser = async (req, res) => {
    const { userId } = req.user;
    console.log("current user: ", userId);

    try {
      const account = await Account.findById(userId);

      return res.status(200).json({
        success: true,
        message: "Lấy thông tin người dùng thành công",
        data: account
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }
  };

  // AccountController.js
  getConTact = async (req, res) => {
    try {
      const { user } = req;
      console.log(">>> get user: ", user);

      const response_data = await AccountService.getContact(user);

      if (response_data) {
        return res.status(200).json({
          success: true,
          user_contact: response_data,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Cannot find user!",
        });
      }
    } catch (err) {
      console.error("❌ Error in getConTact:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  };

  getMoneyWallet = async (req, res) => {
    try {
      const { user } = req;
      const money = await AccountService.getMoneyWallet(user);

      if (money < 0) {
        return res.status(422).json({
          success: false,
          message: "Không thể lấy số dư ví"
        })
      }

      return res.status(200).json({
        success: true,
        message: "Lấy số dư ví thành công",
        money
      })
    }
    catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      })
    }
  };

  getInfoProfile = async (req, res) => {
    try{
      const { id }  = req.params;
    
    const response = await AccountService.getInfoProfile(id);

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Lấy thông tin profile thành công",
        data: response.data
      });
    }
    else{
      return res.status(404).json({
        success: false,
        message: response.message
      });
    }
    }
    catch(err){
      console.log("Error in getInfoProfile: ", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }
  }
}

const calculateAge = (date) => {
  const birth = new Date(date);
  const ageDifMs = Date.now() - birth.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default new AccountController();
