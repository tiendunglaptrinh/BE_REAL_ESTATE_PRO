import { readFile } from "fs/promises";
import axios from "axios";

const locations = JSON.parse(
  await readFile(new URL("../data/locations/tree.json", import.meta.url))
);

class LocationController {
  // Lấy nguyên tree
  getLocation = async (req, res) => {
    try {
      const enrichedLocations = locations.map((loc) => ({
        ...loc,
        priority: (loc.name === "Hà Nội" || loc.name === "Hồ Chí Minh" || loc.name === "Đà Nẵng") ? 2 : 1,
      }));

      return res.status(200).json({
        success: true,
        count: enrichedLocations.length,
        locations: enrichedLocations,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  getNameBySlug = (req, res) => {
    try {
      const { province } = req.params;

      const location = locations.find((loc) => loc.slug === province);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      return res.status(200).json({ success: true, message: "Lấy tên tỉnh/thành phố thành công", name: location.name });
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
        fullname: p.fullName,
      }));
      return res.status(200).json({
        success: true,
        provinces,
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
        wards: province.wards,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  geoCoding = async (req, res) => {
    const address = req.params.address;
    try {
      const url_geocoding = "https://nominatim.openstreetmap.org/search";
      const response = await axios.get(url_geocoding, {
        params: {
          q: address,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          "User-Agent": "MyMapApp/1.0 (contact@myapp.com)",
        },
      });
      console.log("Response data:", response.data);
      if (!response.data || response.data.length === 0) {
        return res.status(404).json({ error: "No results found" });
      }

      const { lat, lon, display_name } = response.data[0];

      return res.json({ lat, lon, display_name });
    } catch (err) {
      console.error("Geocoding error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getListWardByProvinceSlug = async (req, res) => {
    const { slug } = req.body;
    console.log("slug receive: ", slug);

    try {
      const province = locations.find((item) => item.slug === slug);
      console.log("province: ", province);

      if (province) {
        return res.status(200).json({
          success: true,
          message: "Lấy danh sách xã phường thành công",
          province: province.name,
          data: province.wards
        })
      }

      else {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy tỉnh/thành phố"
        })
      }
    }
    catch (err) {
      console.log("error: ", err);
      return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống"
      })
    }

  }
}

export default new LocationController();
