// import Account from "./../models/AccountModel.js";
import Post from "../models/PostModel.js";
import { HashPassword } from "../utils/hash.js";
import JWTService from "./jwtService.js";
import { CompareHash } from "../utils/hash.js";
import slugify from "../utils/slugify.js";

class PostService {
  getPostByFilter = async (queryReq) => {
  const query_param = {};

  // lọc cơ bản trừ category
  if (queryReq.needs) query_param.needs = queryReq.needs;
  if (queryReq.province) query_param.province_slug = queryReq.province;
  if (queryReq.ward) {
    query_param.ward = {
      $in: Array.isArray(queryReq.ward) ? queryReq.ward_slug : [queryReq.ward]
    };
  }

  if (queryReq.min_price || queryReq.max_price) {
    query_param.price_vnd = {};
    if (queryReq.min_price) query_param.price_vnd.$gte = Number(queryReq.min_price);
    if (queryReq.max_price) query_param.price_vnd.$lte = Number(queryReq.max_price);
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
  const safePage = Math.min(Math.max(page, 1), total_page || 1);
  const skip = (safePage - 1) * limit;

  // pipeline
  const pipeline = [
    { $match: query_param },

    // lookup Package
    {
      $lookup: {
        from: "packages",
        localField: "current_package",
        foreignField: "_id",
        as: "package_info",
      },
    },
    { $unwind: { path: "$package_info", preserveNullAndEmptyArrays: true } },

    // lookup real_estate_categories nếu có filter category
    ...(queryReq.category
      ? [
          {
            $lookup: {
              from: "real_estate_categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_info",
            },
          },
          { $unwind: { path: "$category_info", preserveNullAndEmptyArrays: true } },
          { $match: { "category_info.category_slug": queryReq.category } },
        ]
      : []),

    // addFields
    {
      $addFields: {
        priority_level: { $ifNull: ["$package_info.priority_level", 999] },
        package_name: "$package_info.name",
      },
    },

    // sort + pagination
    { $sort: { priority_level: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const posts = await Post.aggregate(pipeline);

  return { posts, total, page: safePage, total_page };
};



  createPost = async (postData) => {
    console.log("[Post Service] - check data input: ", postData);
    try {
      // destructure nếu muốn validate hoặc log
      postData.address_slug = slugify(postData.address);
      postData.province_slug = slugify(postData.province);
      postData.ward_slug = slugify(postData.ward);
      postData.title_slug = slugify(postData.title);

      const num = Number(postData.price);
      const unitPrice = postData.unit_price;
      let price_vnd;

      if (unitPrice.toLowerCase().includes("million")) price_vnd = num * 1000000;
      else if (unitPrice.toLowerCase().includes("billion")) price_vnd = num * 1000000000;
      else price_vnd = num;

      postData.price_vnd = price_vnd;

      // tạo post
      const post = await Post.create(postData);

      const data = post._id.toString();
      // trả về object chuẩn
      return {
        success: true,
        message: "Tạo bài đăng draf thành công",
        data,
      };
    } catch (err) {
      console.error("[Post Service] - createPost error:", err);
      return {
        success: false,
        message: "Hệ thống đang bị lỗi. Vui lòng thử lại sau !!!",
      };
    }
  };
}

export default new PostService();
