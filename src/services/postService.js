// import Account from "./../models/AccountModel.js";
import Post from "../models/PostModel.js";
import { HashPassword } from "../utils/hash.js";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  getTokenFromHeader,
} from "./jwtService.js";
import { CompareHash } from "../utils/hash.js";

class AccountService {
  createPost = async (postData, response) => {
    try {
      console.log(">>> check finished data create: ", postData);
      const post = new Post({
        needs: postData.needs,
        province: postData.province,
        province: postData.province,
        district: postData.district,
        address: postData.address,
        type: postData.type,
        acreage: postData.acreage,
        price: postData.price,
        unitPrice: postData.unitPrice,
        interior: postData.interior,
        title: postData.title,
        description: postData.description,
        nRoom: postData.nRoom,
        nBathroom: postData.nBathroom,
        userId: postData.userId,
        images: postData.images,
        video: postData.video,
        goiTinDang: postData.goiTinDang,
        gia: postData.gia
      });

      console.log("Information of account: ", post);

      await post.save();

      if (!response.headersSent) {
        return response.status(200).json({
          success: true,
          message: "Tạo bài đăng thành công",
          data: post,
        });
      }
    } catch (error) {
      console.error("Error creating account: ", error);
      return response.status(500).json({
        success: false,
        message: "Không thể tạo bài đăng",
        error: error.message || error,
      });
    }
  };
}

export default new AccountService();
