import mongoose from "mongoose";

const Account = mongoose.Schema(
  {
    // thông tin cơ bản
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date },
    sex: { type: String, enum: ["male", "female"] },
    province: { type: String, required: true },
    address: { type: String, required: true },

    // level auth
    is_admin: { type: Boolean, default: false },
    cccd: { type: String, required: true, unique: true },
    date_cccd: { type: Date },
    location_cccd: { type: String },
    authen: { type: Number, required: true, default: 1 }, // 1 = đã otp | stmp     2 = ocr

    // trạng thái hệ thống
    active: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["normal", "banned", "warnned"],
      default: "normal",
    },

    // Cá nhân
    avatar: { type: String, default: "default" },
    favors_post: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    favors_status: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Status",
        default: [],
      },
    ],
    wallet: { type: Number, required: true, default: 50000 },
    total_like_post: {
      type: Number,
      default: 0,
    },
    total_view_post: {
      type: Number,
      default: 0
    },
    total_view_profile: {
      type: Number,
      default: 0
    },

    // auth
    access_token: { type: String },
    refresh_token: { type: String },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model("Account", Account);

export default AccountModel;
