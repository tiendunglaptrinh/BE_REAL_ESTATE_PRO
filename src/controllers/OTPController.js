import mongoose from 'mongoose';
import Conversation from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import ChatbotService from "../services/chatbotService.js";
import otpEmailService from '../services/otpEmailService.js';

class OTPController {
    resendOTP = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required"
                });
            }

            const otp = await otpEmailService.sendOTP(req);

            return res.status(200).json({
                success: true,
                message: "OTP has been resent successfully",
                email: email,
            });
        } catch (error) {
            console.error("Error in resendOTP:", error.message);
            return res.status(500).json({
                success: false,
                message: "Lỗi hệ thống",
                error: error.message
            });
        }
    }
}

export default new OTPController();
