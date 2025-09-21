import paypal from "@paypal/checkout-server-sdk";
import generatePurchaseCode from "../utils/generatePurchaseCode.js";
import PaymentService from "../services/paymentService.js";
import PackageService from "../services/packageService.js";
import Account from "../models/AccountModel.js";

class PaymentController {
  createOrder = async (req, res) => {
    try {
      const amount = req.params.amount?.toString();
      if (!amount) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp số tiền thanh toán",
        });
      }

      // Config Sandbox
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const environment = new paypal.core.SandboxEnvironment(
        clientId,
        clientSecret
      );
      const client = new paypal.core.PayPalHttpClient(environment);

      // Tạo request order
      const request = new paypal.orders.OrdersCreateRequest(); // ✅ Dùng từ paypal.orders
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD", // thay VND -> USD
              value: (Number(amount) / 24000).toFixed(2), // giả sử tỉ giá ~ 24k VND = 1 USD
            },
          },
        ],
      });

      // Gọi API PayPal
      const order = await client.execute(request);

      // Trả orderID cho FE
      return res.status(200).json({
        success: true,
        orderID: order.result.id,
      });
    } catch (err) {
      console.error("PayPal create order error:", err);
      return res.status(500).json({
        success: false,
        message: "Tạo order PayPal thất bại",
      });
    }
  };

  captureOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { post_id, money, start_date, package_pricing_id } = req.body;
      const { userId } = req.user;

      if (!post_id || !money || !start_date || !package_pricing_id) {
        return res.status(422).json({
          success: false,
          message: "Thiếu thông tin cần thiết",
        });
      }

      // PayPal Capture
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
      const client = new paypal.core.PayPalHttpClient(environment);

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await client.execute(request);

      if (capture.result.status !== "COMPLETED") {
        return res.status(400).json({ success: false, message: "Thanh toán PayPal thất bại" });
      }

      // --- Business logic giống paymentNewPostByWallet ---
      const response_data = await PackageService.getPackagePricingById(package_pricing_id);
      if (!response_data.success) {
        return res.status(422).json({ success: false, message: response_data.message });
      }

      const duration = response_data.data.duration_days;
      const start = new Date(start_date);
      let end_date = new Date(start);
      end_date.setDate(end_date.getDate() + duration);

      const dataPurchase = {
        user_id: userId,
        post_id,
        purchase_code: generatePurchaseCode(),
        package_pricing_id,
        amount_paid: money,
        start_date: start,
        end_date,
      };

      const response = await PaymentService.paymentNewPostByPaypal(dataPurchase);

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: "Thanh toán PayPal thành công",
          data: response.data,
        });
      } else {
        return res.status(400).json(response);
      }
    } catch (err) {
      console.error("PayPal capture order error:", err);
      return res.status(500).json({
        success: false,
        message: "Xác nhận order PayPal thất bại",
      });
    }
  };

  captureDeposit = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const { money } = req.body;
      const { userId } = req.user; // user login

      if (!money || Number(money) <= 0) {
        return res.status(400).json({ success: false, message: "Số tiền không hợp lệ" });
      }

      // Config PayPal
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
      const client = new paypal.core.PayPalHttpClient(environment);

      // Capture order từ PayPal
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      const capture = await client.execute(request);

      if (capture.statusCode !== 201 && capture.statusCode !== 200) {
        return res.status(400).json({ success: false, message: "Capture thất bại" });
      }

      // Update wallet user
      const user = await Account.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User không tồn tại" });

      user.wallet += Number(money);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Nạp tiền thành công",
        wallet: user.wallet,
      });
    } catch (err) {
      console.error("PayPal capture deposit error:", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi nạp tiền PayPal",
      });
    }
  };


  paymentNewPostByWallet = async (req, res) => {
    try {
      const { post_id, money, start_date, package_pricing_id } = req.body;
      const { userId } = req.user;

      if (!post_id || !money || !start_date || !package_pricing_id) {
        return res.status(422).json({
          success: false,
          message: "Chưa đầy đủ các trường thông tin",
        });
      }

      const response_data = await PackageService.getPackagePricingById(
        package_pricing_id
      );
      if (!response_data.success) {
        return res.status(422).json({
          success: false,
          message: response_data.message,
        });
      }

      const duration = response_data.data.duration_days;
      console.log("[PaymentController]: check duration: ", duration);

      const start = new Date(start_date);
      let end_date = new Date(start);
      end_date.setDate(end_date.getDate() + duration);
      console.log("[PaymentController]: check end_date: ", end_date);

      const dataPurchase = {
        user_id: userId,
        post_id: post_id,
        purchase_code: generatePurchaseCode(),
        package_pricing_id: package_pricing_id,
        amount_paid: money,
        start_date: start,
        end_date,
      };

      const response = await PaymentService.paymentNewPostByWallet(
        dataPurchase
      );

      if (response.success) {
        return res.status(200).json({
          success: true,
          message: response.message,
          data: response.data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
      });
    }
  };
}

export default new PaymentController();
