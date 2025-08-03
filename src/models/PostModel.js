import mongoose from "mongoose";

const Post = mongoose.Schema(
  {
    needs: { type: String, enum: ["Bán", "Thuê"], required: true, },
    address: { type: String, required: true, },
    province: { type: String, required: true, },
    ward: { type: String, required: true, },
    type: { type: String, required: true, },
    acreage: { type: Number, required: true, },
    price: { type: Number, required: true, },
    unit_price: { type: String, required: true, },
    discount: { type: Number, default: 0, },
    interior: { type: String, },
    num_room: { type: Number, default: 0, },
    num_bathroom: { type: Number, default: 0, },
    title: { type: String, required: true, },
    description: { type: String, required: true, },
    images: { type: [String], required: true, },
    video: { type: String, },
    post_packet: { type: String, required: true, }, 
    packet_post: { type: Number, required: true, },
    is_expire: { type: Boolean, required: true },
    time_expire: { type: Date, required: true },
    is_traded: { type: Boolean, required: true, default: false, },
    num_like: { type: Number, default: 0},
    level_auth: {type: Number, default: 0},
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Liên kết tới user (Account)
      ref: "Account", // Tham chiếu đến model 'Account'
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", Post);

export default PostModel;
