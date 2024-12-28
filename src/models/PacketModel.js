import mongoose from "mongoose";

const PacketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["VIP Kim cương", "VIP Vàng", "VIP Bạc", "Thường"],
      required: true,
    },
    type: {
      type: String,
      enum: ["Bán", "Thuê"],
      required: True,
    },
    category: {
      type: String,
      required: True,
      enum: [
        "Bán đất nền",
        "Bán chung cư",
        "Bán căn hộ mini",
        "Bán nhà riêng",
        "Cho thuê đất nền",
        "Cho thuê chung cư",
        "Cho thuê căn hộ mini",
        "Cho thuê nhà riêng",
      ],
    },
    price: {
      type: Number,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isDisplay: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: String,
      enum: ["tr/m2", "tỷ", "triệu"],
    },
    nroom: {
      type: Number,
    },
    nfloor: {
      type: Number,
    },
    nbathroom: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

const PacketModel = mongoose.model("Packet", PacketSchema);

export default PacketModel;
