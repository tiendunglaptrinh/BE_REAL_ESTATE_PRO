import Post from "../models/PostModel.js";

class PostController {
  getAllPost = async (req, res, next) => {
    try {
      const posts = await Post.find({});
      res.status(200).json({
        success: true,
        count: accounts.length,
        data: posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu bài đăng",
        error: error.message
      });
    }
  };

  create = async (req, res, next) => {
    try {
      const {
        name,
        price,
        location,
        description,
        type,
        toilet,
        room,
        bedroom,
        area,
      } = req.body;
      if (!name || !price || !location || !description || !type || !area) {
        res.status(500).json({
          success: false,
          message: "Thông tin bài đăng còn thiếu, vui lòng nhập lại.",
        });
      } else {
        const post = await Account.create({ name, price, location, description, type, toilet, room, bedroom, area });
        res.status(201).json({
          success: true,
          message: "Đăng tin thành công",
          data: post,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Không thể đăng bài",
        error: error.message,
      });
      next(error);
    }
  };
}


export default new PostController();