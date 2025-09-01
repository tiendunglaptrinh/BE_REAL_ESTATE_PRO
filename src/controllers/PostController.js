import Post from "../models/PostModel.js";
import JWTService from "../services/jwtService.js";
import PostService from "../services/postService.js";

class PostController {
  getPosts = async (req, res, next) => {
    try {
      const {
        needs,
        province,
        type,
        ward,
        min_price,
        max_price,
        min_acreage,
        max_acreage,
      } = req.query;

      const result = await PostService.getPostByFilter(req.query);

      // return { posts, total, page, total_page };
      return res.status(200).json({
        success: true,
        message: "Lấy bài đăng thành công!",
        total_pages: result.total_page,
        current_index_page: result.page,
        count_post_in_page: result.posts.length,
        data_posts: result.posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu bài đăng!",
        error: error.message,
      });
    }
  };

  getPostBySearch = async (req, res, next) => {
    const { searchInfo } = req.params["search-info"];
    const searchRegex = new RegExp(searchInfo, "i");
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchRegex } },
        { address: { $regex: searchRegex } },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Search bài đăng thành công !",
      count_posts: posts.length,
      data: posts,
    });
  };
  
  getpost = async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.find({ _id: postId });

      if (!post) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy bài đăng!!!",
        });
      } else
        return res.status(200).json({
          success: true,
          message: "Lấy bài đăng thành công",
          data: post,
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu bài đăng",
        error: error.message,
      });
    }
  };
  createPostStep1 = (req, res) => {
    const token = JWTService.getTokenFromHeader(req, res);
    const user_id = JWTService.decodeToken(token);
    console.log(">>> [Create post step 1]: check decode token: ", user_id);

    // data receive
    const {
      needs,
      address,
      province,
      ward,
      category_id,
      acreage,
      price,
      unit_price,
      property_components,
      facilities,
      title,
      description,
      latitude,
      longitude,
    } = req.body;

    try {
      if (
        !needs ||
        !address ||
        !province ||
        !ward ||
        !category_id ||
        !acreage ||
        !price ||
        !unit_price ||
        !property_components ||
        !facilities ||
        !title ||
        !description ||
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({
          success: false,
          message: "Nhập đầy đủ các trường thông tin post !!!",
        });
      }
      const step = 1;
      const post = {
        needs,
        address,
        province,
        ward,
        category_id,
        acreage: Number(acreage),
        price: Number(price),
        unit_price,
        property_components,
        facilities,
        title,
        description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        user_id,
        step,
      };
      console.log(">>> check post data: ", post);
      if (!req.session) {
        req.session = {};
      }
      req.session.postData = post;
      return res.status(200).json({
        step: 1,
        success: true,
        message: "Bước 1 hoàn tất",
        data: req.session.postData,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  createPostStep2 = async (req, res) => {
    try {
      const { images, video } = req.body;
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Upload đầy đủ hình ảnh dưới dạng mảng.",
        });
      }
      const currentPost = req.session.postData;
      if (!currentPost) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập thông tin từ bước 1.",
        });
      }
      req.session.postData = {
        ...currentPost,
        step: 2,
        images,
        video,
      };

      return res.status(200).json({
        success: true,
        data: req.session.postData,
      });
    } catch (error) {
      console.error("Error in createPostStep2:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  };

  // tạo post draf lưu tiến trình
  createPostStep3 = async (req, res) => {
    const { current_package, time_expire, status } = req.body;
    try {
      const currentPost = req.session.postData;
      if (!currentPost) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập thông tin ở bước 2 !!!",
        });
      }

      console.log("Data in current step: ", currentPost);

      if (!current_package || !time_expire || !status) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập đủ thông tin !!!",
        });
      }

      // Chưa truyền thông tin bước 3.
      currentPost.current_package = current_package;
      currentPost.time_expire = time_expire;
      currentPost.status = status;
      const response = await PostService.createPost(currentPost);

      // Thanh toán thất bại
      if (response.success) {
        return res.status(200).json({
          success: true,
          data: response.message,
        });
      }
      // Thanh toán thành công
      else {
        return res.status(500).json({
          success: false,
          message: response.message,
          data: response.data,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  getPostFilterProvince = async (req, res) => {
    const province = req.params.province;
  };

  getPostFilterWard = async (req, res) => {
    const ward = req.params.ward;
  };
}

export default new PostController();
