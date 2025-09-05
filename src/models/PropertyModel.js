import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // "Phòng ngủ", "Phòng tắm"…,
    level: {type: Number, required: true, default: 0},
    icon: {type: String, required: true}
  },

  {
    collection: "properties",
  }
);

const PropertyModel = mongoose.model( "Property", PropertySchema );
export default PropertyModel;