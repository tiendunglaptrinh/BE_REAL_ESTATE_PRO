import mongoose from "mongoose";

const Account = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true},
    password: { type: String, required: true },
    birthday: { type: Date },
    sex: { type: String, enum: ["male", "female"] },
    address: { type: String, required: true},
    isAdmin: { type: Boolean, default: false },
    CCCD: { type: String, required: true, unique: true },
    dateCCCD: { type: Date},
    locationCCCD: { type: String},
    wallet: { type: Number, required: true, default: 50000 },
    active: { type: Boolean, default: false },
    status: { type: String, enum: ["normal", "banned", "warnned"], default: 'normal' },
    avatar: {type: String},
    access_token: {type: String},
    refresh_token: { type: String },
  },
  { timestamps: true }
);

const AccountModel = mongoose.model("Account", Account);

export default AccountModel;
