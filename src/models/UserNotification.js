import mongoose from "mongoose";

const UserNotificationSchema = new mongoose.Schema(
  {
    receiver_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
    },
    type: {
      type: String,
      enum: ["post_contact", "status_contact", "status_approved"],
      required: true,
    },
    related_post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
    related_status: {
      type: mongoose.Schema.ObjectId,
      ref: "Status",
    },
    message: {
      type: String,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: "user_notification" }
);

UserNotificationSchema.index({ receiver_id: 1, is_read: 1, createdAt: -1 });

const UserNotificationModel = mongoose.model(
  "UserNotification",
  UserNotificationSchema
);
export default UserNotificationModel;
