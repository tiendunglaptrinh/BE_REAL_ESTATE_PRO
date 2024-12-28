import mongoose from "mongoose";

const PacketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["VIP Kim cương", "VIP Vàng", "VIP Bạc", "Thường"],
      required: true,
    },
    options: [
      {
        duration: {
          type: Number,
          enum: [7, 10, 15],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    promotion: { 
      type: Number, 
      required: true, 
      default: 0, // Khuyến mãi mặc định là 0
    },
    description: {
      type: String, // Thay thế Text bằng String
      required: false,
    },
  },
  { timestamps: true }
);

PacketSchema.methods.calculateBasePrice = function (duration) {
  const option = this.options.find((opt) => opt.duration === duration);
  if (!option) return null; 
  const price = option.price;
  return price * duration - this.promotion;
};

const PacketModel = mongoose.model("Packet", PacketSchema);

export default PacketModel;
