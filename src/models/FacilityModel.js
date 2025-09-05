import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "Ti vi", "Tủ lạnh"
  icon : { type: String, required: true}
});

const FacilityModel = mongoose.model("Facility", FacilitySchema);
export default FacilityModel;