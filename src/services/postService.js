// import Account from "./../models/AccountModel.js";
import Post from "../models/PostModel.js";
import { HashPassword } from "../utils/hash.js";
import JWTService from "./jwtService.js";
import { CompareHash } from "../utils/hash.js";
import slugify from "../utils/slugify.js";

class PostService {
  getPostByFilter = async (queryReq) => {
    console.log("[Post Service] - getPostByFilter with query: ", queryReq);

    const query_param = {};

    // lọc cơ bản trừ category
    if (queryReq.needs) query_param.needs = queryReq.needs;
    if (queryReq.province) query_param.province_slug = queryReq.province;
    if (queryReq.ward) {
      query_param.ward_slug = { $in: Array.isArray(queryReq.ward) ? queryReq.ward : [queryReq.ward] };
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
    const limit = Number(queryReq.limit) || 12;
    const page = Number(queryReq.page) || 1;
    const skip = (page - 1) * limit;

    // pipeline với facet
    const pipeline = [
      { $match: query_param },

      // lookup package
      {
        $lookup: {
          from: "packages",
          localField: "current_package",
          foreignField: "_id",
          as: "package_info",
        },
      },
      { $unwind: { path: "$package_info", preserveNullAndEmptyArrays: true } },

      // lookup category
      {
        $lookup: {
          from: "real_estate_categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_info",
        },
      },
      { $unwind: { path: "$category_info", preserveNullAndEmptyArrays: true } },

      // filter theo category nếu có
      ...(queryReq.category && Array.isArray(queryReq.category) && queryReq.category.length > 0
        ? [{ $match: { "category_info.category_slug": { $in: queryReq.category } } }]
        : []),

      // addFields
      {
        $addFields: {
          priority_level: { $ifNull: ["$package_info.priority_level", 999] },
          package_name: "$package_info.name",
          category_slug: "$category_info.category_slug",
        },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: { priority_level: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        },
      },
    ];

    const result = await Post.aggregate(pipeline);
    const posts = result[0]?.data || [];
    const total = result[0]?.total || 0;
    const total_page = Math.ceil(total / limit);

    return { posts, total, page, total_page };
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
        message: "Tạo bài đăng draft thành công",
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
