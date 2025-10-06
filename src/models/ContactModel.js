import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    // Người tạo contact
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    // Người nhận contact
    receive_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    // Nội dung contact
    content: {
      type: String,
      required: true,
      trim: true, // bỏ khoảng trắng thừa
    },

    // Người nhận đọc contact chưa?
    is_read : {
      type: Boolean,
      required: true,
      default: false
    },

    // Tình trạng contact
    status: {
      type: String,
      required: true,
      enum: ["published", "delete", "admin_delete"],
      default: "published"
    }
  },
  {
    timestamps: true,
  }
);

const MessageContactModel = mongoose.model("Contact", ContactSchema);

export default MessageContactModel;