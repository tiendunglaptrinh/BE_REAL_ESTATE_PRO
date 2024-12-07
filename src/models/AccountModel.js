import mongoose from "mongoose";

const Account = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true},
    birthday: { type: Date },
    address: { type: String, required: true},
    isAdmin: { type: Boolean, default: false },
    CCCD_id: { type: String, required: true, unique: true },
    money_in_wallet: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: false },
    status: { type: String, enum: ["normal", "banned", "warnned"], default: 'normal' },
    access_token: { type: String },
    refresh_token: { type: String },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model("Account", Account);

export default AccountModel;
