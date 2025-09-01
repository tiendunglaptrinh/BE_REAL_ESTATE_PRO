import PackagePricing from "../models/PackagePricingModel.js";

class PackageService {
  getPackagePricingById = async (id) => {
    try {
      const package_pricing = await PackagePricing.findById(id);
      return {
        success: true,
        message: "Lấy thông tin chi tiết bài đăng thành công !!!",
        data: package_pricing,
      };
    } catch (err) {
      return {
        success: false,
        message: "Lấy thông tin chi tiết gói thất bại !!!",
      };
    }
  };
}

export default new PackageService();
