import "dotenv";
import { createClient } from "@redis/client";
import nodemailer from "nodemailer";

class OTPEmailService {
  constructor() {
    this.client = createClient({
      url: process.env.UPSTASH_REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false,
      },
    });

    this.client.on("error", (err) => {
      console.log("Redis Error: ", err);
    });

    this.client
      .connect()
      .then(() => console.log("Connected to Redis"))
      .catch((err) => console.error("Redis connection error:", err));
  }

  sendOTP = async (req) => {
    try {
      const { email } = req.body;
      if (!email) {
        throw Error("Email not found", error);
      }

      const otp = this.generateOTP();

      // Gửi otp qua email
      const transporter = nodemailer.createTransport({
        host: process.env.HOST_STMP,
        port: process.env.PORT_SEND_SMTP,
        secure: true,
        auth: {
          user: process.env.EMAIL_SEND,
          pass: process.env.PASSWORD_EMAIL_APP,
        },
      });

      const mailOptions = {
        from: `Hệ thống website REAL ESTATE PRO <${process.env.SEND_EMAIL}>`,
        to: email,
        subject: "Xác thực tài khoản - Mã OTP từ REAL ESTATE PRO", // ← Thêm dòng này
        html: `
    <h1>Xin cảm ơn bạn đã quan tâm đến REAL ESTATE PRO</h1>
    <p>Mã xác thực OTP của bạn là <strong>${otp}</strong>. Mã OTP sẽ hết hạn sau 5 phút, vui lòng sử dụng trước thời gian này.</p>
    <p>Xin cảm ơn.</p>
  `,
      };

      transporter
        .sendMail(mailOptions)
        .then((info) => {
          console.log("Email sent: ", info.messageId);
        })
        .catch((error) => {
          console.error("Lỗi gửi email: ", error);
        });

      // Redis:
      const ttl = 1 * 60;

      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.setEx(`otp:${email}`, ttl, otp);

      return otp;
    } catch (error) {
      console.log("Error in sending OTP: ", error.message);
      throw error;
    }
  };

  generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  verifyOTP = async (email, otp) => {
    try {
      if (!email || !otp) throw Error("Fill full infomation");
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const storeOtp = await this.client.get(`otp:${email}`);
      if (!storeOtp) {
        return false;
      }
      return storeOtp === otp;
    } catch (error) {
      console.log("Error in sending otp throuh email: ", error.message);
      throw error;
    }
  };
}

export default new OTPEmailService();
