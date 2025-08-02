import mongoose from "mongoose";

const Account = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    sex: { type: String, enum: ["male", "female"] },
    province: { type: String, required: true },
    address: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    cccd: { type: String, required: true, unique: true },
    date_cccd: { type: Date },
    location_cccd: { type: String },
    wallet: { type: Number, required: true, default: 50000 },
    active: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["normal", "banned", "warnned"],
      default: "normal",
    },
    avatar: { type: String, default: "None" },
    authen: { type: Number, required: true, default: 1 }, // 1 = đã otp | stmp     2 = ocr
    favors_post: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    num_concern: {
      type: Number,
      default: 0,
    },
    access_token: { type: String },
    refresh_token: { type: String },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model("Account", Account);

export default AccountModel;
