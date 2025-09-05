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

  getFacilityByListId = async (req, res) =>{
    const {listId} = req.body;
    try {
      const listFacility = await Facility.find({ _id: { $in: listId } }).lean();

      return res.status(200).json({
        success: true,
        message:"Lấy danh sách tiện ích thành công",
        data: listFacility
      });
    }
    catch(err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }
  }
}

export default new FacilityController();
