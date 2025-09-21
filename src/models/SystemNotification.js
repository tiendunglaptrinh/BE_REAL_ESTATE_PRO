import mongoose from "mongoose";

const SystemNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["system", "update", "maintenance"],
      default: "system",
    },
    sender_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      default: null, // admin gửi thì có, hệ thống auto thì null
    },
  },
  { timestamps: true, collection: "system_notification" }
);

const SystemNotificationModel = mongoose.model(
  "SystemNotification",
  SystemNotificationSchema
);
export default SystemNotificationModel;
