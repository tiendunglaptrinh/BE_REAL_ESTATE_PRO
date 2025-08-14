import mongoose from "mongoose";

const PropertyComponentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "Phòng ngủ", "Phòng tắm"…
});

const PropertyComponentModel = mongoose.model(
  "PropertyComponent",
  PropertyComponentSchema
);
export default PropertyComponentModel;
