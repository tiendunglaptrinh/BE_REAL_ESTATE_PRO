// utils/slugify.js
export default function slugify(str) {
  if (!str) return "";

  return str
    .toString()
    .normalize("NFD")                      // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "")       // xóa dấu
    .replace(/đ/g, "d")                    // thay đ -> d
    .replace(/Đ/g, "d")                    // thay Đ -> d
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")          // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-")                  // thay space = "-"
    .replace(/-+/g, "-");                  // gộp nhiều "-" thành 1
}
