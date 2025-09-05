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
    console.log("listId: ", listId);
    try {
      const listProperty = await Property.find({ _id: { $in: listId } }).lean();
      return res.status(200).json({
        success: true,
        data: listProperty
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      });
    }
  };

}

export default new PropertyController();
