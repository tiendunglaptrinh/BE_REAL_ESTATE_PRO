import mongoose from "mongoose";

const PropertyComponentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "Phòng ngủ", "Phòng tắm"…
},{
    collection: "properties_component"
});

const PropertyComponentModel = mongoose.model(
  "PropertyComponent",
  PropertyComponentSchema
);
export default PropertyComponentModel;
