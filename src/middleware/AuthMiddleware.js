import jwt from "jsonwebtoken";
import "dotenv/config";
import JwtService from "../services/jwtService.js";

const userAuthMiddleware = (req, res, next) => {
  const token = JwtService.getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token does not exist",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    // userRole là biến boolean (isAdmin) => Nếu là Admin không cho vào route có authorization là  Người dùng.
    if (user.userRole && user.userRole == "admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }
    req.user = user;
    next();
  });
};

const adminAuthMiddleware = (req, res, next) => {
  const token = JwtService.getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token does not exist",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
    if (user.userRole && user.userRole == "user") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }
    // Nếu là admin, lưu thông tin người dùng vào req để sử dụng tiếp trong các route
    req.user = user;
    next();
  });
};

const authMiddleware = (req, res, next) => {
  const token = JwtService.getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is not exist",
    });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }
    req.user = user;
    next();
  });
};

export { authMiddleware, userAuthMiddleware, adminAuthMiddleware };
