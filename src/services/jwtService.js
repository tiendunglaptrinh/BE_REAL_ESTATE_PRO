import jwt from "jsonwebtoken";
import "dotenv/config";

class JWTService {
  generateAccessToken = (payload_user) => {
    const access_token = jwt.sign(payload_user, process.env.ACCESS_TOKEN, {
      expiresIn: "50m",
    });
    return access_token;
  };

  generateRefreshToken = (payload_user) => {
    const refresh_token = jwt.sign(payload_user, process.env.REFRESH_TOKEN, {
      expiresIn: "1 days",
    });
    return refresh_token;
  };

  // POST: /refresh-token
  refreshTokenService = async (req, res, next) => {
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

  getTokenFromHeader = (req) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return null;
    }
    return authHeader.split(" ")[1];
  };

  // getTokenFromCookie = (req, res) => {
  //   const token = req.cookies?.access_token;
  //   if (!token) null;
  //   return token;
  // };

  decodeToken = (token) => {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
    const userId = decode.userId;
    return userId;
  };
}

export default new JWTService();
