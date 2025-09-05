import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    },
    conversation_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender_role: {
      type: String,
      required: true,
      enum: ["assistant", "user"],
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      type: [
        {
          type: {
            type: String,
            enum: ["link", "image", "file"],
            default: "link",
          },
          value: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

MessageSchema.index({ conversation_id: 1, createdAt: -1 });

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
