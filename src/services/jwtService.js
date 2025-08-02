import jwt from "jsonwebtoken";
import "dotenv/config";

const generateAccessToken = (payload_user) => {
  //   console.log(">>> check payload: ", payload_user);
  const access_token = jwt.sign(payload_user, process.env.ACCESS_TOKEN, {
    expiresIn: "50m",
  });
  return access_token;
};

const generateRefreshToken = (payload_user) => {
  //   console.log(">>> check payload: ", payload_user);
  const refresh_token = jwt.sign(payload_user, process.env.REFRESH_TOKEN, {
    expiresIn: "1 days",
  });
  return refresh_token;
};

// POST: /refresh-token
const refreshTokenService = async (req, res, next) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    const userId = decoded.userId;
    const userRole = decoded.userRole;

    const newAccessToken = jwt.sign(
      { userId: userId, userRole: userRole },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "10m",
      }
    );
    return res.status(200).json({
      success: true,
      [process.env.ACCESS_TOKEN]: newAccessToken,
    });
  } catch (error) {}
  next();
};
const getTokenFromHeader = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Token does not exist",
    });
  }
  return authHeader.split(" ")[1];
};

const decodeToken = (token) => {
  const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
  const userId = decode.userId;
  return userId;
};

export {
  generateAccessToken,
  generateRefreshToken,
  refreshTokenService,
  getTokenFromHeader,
  decodeToken,
};
