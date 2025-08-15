import RealEstateCategory from "./../models/RealEstateCategoryModel.js";

class CategoryController {
  getAllCategory = async (req, res) => {
    try {
      const all_category = await RealEstateCategory.find({});
      return res.status(200).json({
        success: true,
        category: all_category,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
  getSellCategory = async (req, res) => {
    try {
      const sell_category = await RealEstateCategory.find({ type: "sell" });

      return res.status(200).json({
        success: true,
        categories: sell_category,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  getRentCategory = async (req, res) => {
    try {
      const rent_category = await RealEstateCategory.find({
        $or: [{ type: "rent" }, { type: "short_utility" }],
      });

      return res.status(200).json({
        success: true,
        categories: rent_category,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

export default new CategoryController();
