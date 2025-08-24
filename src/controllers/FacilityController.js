import Facility from "./../models/FacilityModel.js";

class FacilityController {
  getAllFacility = async (req, res) => {
    try {
      const all_facilities = await Facility.find({});
      return res.status(200).json({
        success: true,
        all_facilities,
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
}

export default new FacilityController();
