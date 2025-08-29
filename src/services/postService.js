// import Account from "./../models/AccountModel.js";
import Post from "../models/PostModel.js";
import { HashPassword } from "../utils/hash.js";
import JWTService from "./jwtService.js";
import { CompareHash } from "../utils/hash.js";

class PostService {
  getPostByFilter = async (queryReq) => {
    const query_param = {};

    // check query param
    if (queryReq.needs) query_param.needs = queryReq.needs;
    if (queryReq.type) query_param.type = queryReq.type;
    if (queryReq.province) query_param.province = queryReq.province;
    if (queryReq.ward) query_param.ward = queryReq.ward;
    if (queryReq.min_price || queryReq.max_price) {
      query_param.price = {};
      if (queryReq.min_price) query_param.price.$gte = Number(queryReq.min_price);
      if (queryReq.max_price) query_param.price.$lte = Number(queryReq.max_price);
    }
    if (queryReq.min_acreage || queryReq.max_acreage) {
      query_param.acreage = {};
      if (queryReq.min_acreage) query_param.acreage.$gte = Number(queryReq.min_acreage);
      if (queryReq.max_acreage) query_param.acreage.$lte = Number(queryReq.max_acreage);
    }

    // pagination
    const total = await Post.countDocuments(query_param);
    const limit = Number(queryReq.limit) || 12;
    const page = Number(queryReq.page) || 1;
    const total_page = Math.ceil(total / limit);

    // validate param: page
    if (page > total_page) page = total_page;
    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    // filter post
    const posts = await Post.aggregate([
      { $match: query_param },
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$post_packet", "KC"] }, then: 1 },
                { case: { $eq: ["$post_packet", "V"] }, then: 2 },
                { case: { $eq: ["$post_packet", "B"] }, then: 3 },
                { case: { $eq: ["$post_packet", "T"] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      },
      { $sort: { sortOrder: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return { posts, total, page, total_page };
  };

  createPost = async (postData) => {
    console.log("[Post Service] - check data input: ", postData);
    try{

      // kiểm tra không đủ tiền - tạo post(pending) - tạo purchase(new, pending)
      return {success: false, message: "Số dư tài khoản không đủ. Vui lòng nạp thêm tiền hoặc chọn phương thức thanh toán khác !!!"}

      // kiểm tra thành công - tạo post(display) - tạo purchase(new, paid) - trừ tiền nếu là thanh toán "personal"
    }
    catch (err){
      return {success: false, message: "Hệ thống đang bị lỗi. Vui lòng thử lại sau !!!"}
    }
  };
}

export default new PostService();
