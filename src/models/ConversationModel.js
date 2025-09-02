import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
      required: true,
    },
    last_message: {
      type: String,
    },
    last_message_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index để load nhanh các cuộc trò chuyện của user
ConversationSchema.index({ user_id: 1, last_message_at: -1 });

const ConversationModel = mongoose.model("Conversation", ConversationSchema);
export default ConversationModel;
