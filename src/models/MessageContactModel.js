import mongoose from "mongoose";

const MessageContactSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true, // bỏ khoảng trắng thừa
    },
  },
  {
    timestamps: true,
    collection: "message_contact",
  }
);

const MessageContactModel = mongoose.model("MessageContact", MessageContactSchema);

export default MessageContactModel;