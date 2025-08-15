import { readFile } from "fs/promises";

const locations = JSON.parse(
  await readFile(
    new URL("../data/locations/tree.json", import.meta.url)
  )
);

class LocationController {
  // Lấy nguyên tree
  getLocation = async (req, res) => {
    try {
      return res.status(200).json({
        success: true, 
        locations
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  // Lấy danh sách tỉnh
  getProvince = async (req, res) => {
    try {
      const provinces = locations.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        type: p.type,
        is_central: p.isCentral,
        slug: p.slug,
        fullname: p.fullName
      }));
      return res.status(200).json({
        success: true,
        provinces
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  // Lấy danh sách xã theo tỉnh
  getWardFromProvince = async (req, res) => {
    try {
      const { provinceCode } = req.params;
      const province = locations.find((p) => p.code === provinceCode);

      if (!province) {
        return res.status(404).json({ error: "Province not found" });
      }

      return res.status(200).json({
        success: true,
        wards: province.wards
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
}

export default new LocationController();
