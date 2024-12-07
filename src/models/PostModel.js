import mongoose from "mongoose";

const Post = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    lat: { type: String },
    long: { type: String },
    description: { type: String, require: true },
    type: { type: String, require: true },
    num_toilet: { type: Number },
    num_room: { type: Number },
    num_bedroom: { type: Number },
    amenities: { type: Map, of: String, default: {} },
    area: { type: Number, require: true },
    authenticate: { type: String, enum: ["yes", "no"], default: "no" },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", Post);

export default PostModel;
