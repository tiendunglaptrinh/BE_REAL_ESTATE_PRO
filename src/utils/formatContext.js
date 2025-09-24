function formatContext(content) {
  return content
    // bỏ ** markdown
    .replace(/\*\*/g, "")
    // in đậm "Bài đăng x"
    .replace(/Bài đăng\s*(\d+)/gi, (_, p1) => `<b style="color: #115ca8">Bài đăng ${p1}</b>`)
    // tiêu đề in đậm nhẹ hơn
    .replace(/title:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">${p1}</span>`)
    // Diện tích
    .replace(/acreage:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">Diện tích:</span> ${p1}`)
    // Giá cả
    .replace(/price:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">Giá cả:</span> ${p1}`)
    // Đường dẫn (thẻ a)
    .replace(/url:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">Đường dẫn:</span> <a style="text-decoration: underline" href="${p1}">Link bài viết</a>`);
}

export default formatContext;
