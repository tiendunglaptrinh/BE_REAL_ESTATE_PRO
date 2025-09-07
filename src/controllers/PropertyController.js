import Property from "./../models/PropertyModel.js";

class PropertyController {
  getAllProperty = async (req, res) => {
    try {
      const all_properties = await Property.find({});
      return res.status(200).json({
        success: true,
        all_properties,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  addCategory = async (req, res) => {
    try {
      const { category_name } = req.body;
    } catch {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  getListPropertyById = async (req, res) => {
    const { listId } = req.body;

    if (!Array.isArray(listId) || listId.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách ID không hợp lệ",
      });
    }

    try {
      // lấy ra mảng id
      const ids = listId.map(item => item.id);

      // query theo mảng id
      const listProperty = await Property.find({ _id: { $in: ids } }).lean();

      // merge quantity vào kết quả
      const merged = listProperty.map(prop => {
        const found = listId.find(item => item.id == prop._id.toString());
        return {
          ...prop,
          quantity: found?.quantity ?? 0, // mặc định 0 nếu không có
        };
      });

      console.log(merged)
      return res.status(200).json({
        success: true,
        data: merged,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống",
      });
    }
  };


}

export default new PropertyController();
