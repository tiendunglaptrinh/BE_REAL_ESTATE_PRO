import jwt from "jsonwebtoken";
import "dotenv/config";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Token does not exist",
    });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
    req.user = user;
    // console.log(">>> check user Id in middleware: ", userId);
    next();
  });
};

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Token does not exist",
    });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
    // Kiểm tra userRole
    if (!user.userRole) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }
    // Nếu là admin, lưu thông tin người dùng vào req để sử dụng tiếp trong các route
    req.user = user;
    next();
  });
};

export { authMiddleware, adminAuthMiddleware };
