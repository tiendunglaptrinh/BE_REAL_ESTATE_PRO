import Post from "../models/PostModel.js";
import { getTokenFromHeader, decodeToken } from "../services/jwtService.js";
import PostService from "../services/postService.js";

class PostController {
  getAllPost = async (req, res, next) => {
    try {
      const posts = await Post.find({});
      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu bài đăng",
        error: error.message,
      });
    }
  };
  getpost = async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.find({_id: postId});

      if (!post) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy bài đăng!!!"
        })
      }
      else return res.status(200).json({
        success: true,
        message: "Lấy bài đăng thành công",
        data: post
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu bài đăng",
        error: error.message,
      });
    }
  };
  createPostStep1 = (req, res) => {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status.json({
        success: false,
        message: "Unauthorization !!!",
      });
    }
    const userId = decodeToken(token);
    console.log(">>> check decode token: ", userId);
    const {
      needs,
      province,
      district,
      address,
      type,
      acreage,
      price,
      unitPrice,
      interior,
      title,
      description,
      nRoom,
      nBathroom,
    } = req.body;
    try {
      if (
        !needs ||
        !province ||
        !district ||
        !address ||
        !type ||
        !acreage ||
        !price ||
        !unitPrice ||
        !title ||
        !description
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
        district,
        type,
        acreage,
        price,
        unitPrice,
        interior,
        title,
        description,
        nRoom,
        nBathroom,
        userId,
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

  createPostStep3 = async (req, res) => {
    const { goiTinDang, gia } = req.body;
    try {
      if (!goiTinDang || !gia) {
        return res.status.json({
          success: false,
          message: "Vui lòng nhập đầy đủ thông tin |||",
        });
      }
      const currentPost = req.session.postData;
      if (!currentPost) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập thông tin đầy đủ từ bước 1",
        });
      }
      req.session.postData = {
        ...currentPost,
        goiTinDang,
        gia,
      };
      return await PostService.createPost(req.session.postData, res);
    } catch (error) {
      return res.status.json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default new PostController();
