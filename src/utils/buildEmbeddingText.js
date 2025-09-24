function buildEmbeddingText(post) {
  const needsText = post.needs === "sell" ? "bán" : "cho thuê";
  return `${needsText}. Địa chỉ: ${post.address}. Diện tích: ${post.acreage} m2. Giá: ${post.price} ${post.unit_price}.`;
}

export default buildEmbeddingText;