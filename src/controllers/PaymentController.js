import paypal from "@paypal/checkout-server-sdk";

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
      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
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
}

export default new PaymentController();
