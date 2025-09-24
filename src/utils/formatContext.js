function formatContext(content) {
  let postUrl = null;

  // Tạm giữ url post khi parse
  content = content.replace(/url:\s*(.+)/gi, (_, p1) => {
    postUrl = p1.trim();
    return `<span style="font-weight:600">Đường dẫn:</span> <a style="text-decoration: underline" href="${p1}" target="_blank">Link bài viết</a>`;
  });

  return content
    // bỏ ** markdown
    .replace(/\*\*/g, "")
    // in đậm "Bài đăng x"
    .replace(/Bài đăng\s*(\d+)/gi, (_, p1) => `<b style="color: #115ca8">Bài đăng ${p1}</b>`)
    // tiêu đề
    .replace(/title:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">${p1}</span>`)
    // Diện tích
    .replace(/acreage:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">Diện tích:</span> ${p1}`)
    // Giá cả
    .replace(/price:\s*(.+)/gi, (_, p1) => `<span style="font-weight:600">Giá cả:</span> ${p1}`)
    // Ảnh (dùng url post nếu có, fallback là chính link ảnh)
    .replace(/image:\s*(.+)/gi, (_, p1) => {
  const imageUrl = p1.trim();
  const href = postUrl || imageUrl;
  return `<div><a href="${href}" target="_blank"><img src="${imageUrl}" alt="post image" style="max-width: 100%; aspect-ratio: 1.6; border-radius: 8px; margin-top: 6px; cursor: pointer;" /></a></div>`;
})

}

export default formatContext;
