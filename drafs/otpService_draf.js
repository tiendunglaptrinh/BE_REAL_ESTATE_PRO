import "dotenv/config";
import twilio from "twilio";
import { createClient } from "@redis/client";

class OTPService {
  constructor() {
    this.client = createClient({
      url: process.env.UPSTASH_REDIS_URL,
      socket: {
        tls: true,
        rejectUnthorized: false,
      },
    });
    this.client.on("error", (err) => {
      console.log("Redis Error: ", err);
    });

    this.client
      .connect((response) =>
        console.log("Connecting Redis Database successfully")
      )
      .catch((err) => console.error("Error connecting to Redis", redis));
  }

  sendOTP = async (req, res) => {
    try {
      const { phone } = req.body;
      const phone_receive = process.env.RECEIVE_PHONE; // Đang để tạm hard code vì đang dùng tài khoản Trial Twilio,sau này sẽ chuyển thành phone_receive = phone
      const account_sid = process.env.TWILIO_ACCOUNT_SID;
      const auth_token = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE;

      const client = twilio(account_sid, auth_token);
        
      const otp = await this.generateOTP();

      const message = await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: twilioPhone,
        to: phone_receive,
      });

      const ttl = 1 * 60;

      if (!this.client.isOpen) { await this.client.connect(); }
      await this.client.setEx(`otp:${phone_receive}`, ttl, otp);

      console.log(`[OTP Service]: OTP sent successfully to ${phone_receive}: ${message.sid}`);

      return otp;
    } catch (error) {
      console.log("Error in sending OTP: ", error.message);
      throw(error)
    }
  };

  generateOTP = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpString = otp.toString();
    return otpString;
  };

  verifyOTP = async (phone, otp) => {
    try {
      if (!phone || !otp) {
        return false;
      }
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const storeOtp = await this.client.get(`otp:${phone}`);
      if (!storeOtp) {
        return false;
      }
      return storeOtp === otp;
    } catch (error) {
      console.error("Error verifying OTP: ", error.message);
      return false;
    }
  };
}

export default new OTPService();
